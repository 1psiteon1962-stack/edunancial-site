// Q2 — encrypted curriculum archive (library; dependency-free so CI can test it).
//
// THIS REPOSITORY IS PUBLIC. The archive holds the full durable curriculum state
// (published lessons, translation packages, receipts), so it is committed ONLY as
// an AES-256-GCM sealed bundle on the orphan branch `curriculum-archive`.
// Plaintext exists only in job memory (and in a temporary directory during a
// restore drill).
//
// Key: CURRICULUM_ARCHIVE_ENCRYPTION_KEY if set, otherwise the existing
// BLOG_ARCHIVE_ENCRYPTION_KEY (32 random bytes, base64). Separate encryption and
// MAC keys are derived with HKDF under curriculum-specific labels, so a blog
// archive key never decrypts or authenticates a curriculum bundle and vice versa.
//
// Bundle format: "EDUCURR1" | 12-byte IV | 16-byte GCM tag | ciphertext(gzip(canonical JSON))
import { createCipheriv, createDecipheriv, createHash, createHmac, hkdfSync, randomBytes, timingSafeEqual } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, normalize, sep } from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";

const MAGIC = Buffer.from("EDUCURR1");
export const BUNDLE_FILE = "curriculum-archive.enc";
export const HMAC_FILE = "curriculum-archive.hmac";
export const ARCHIVE_BRANCH = "curriculum-archive";
export const ALLOWED_BRANCH_FILES = [BUNDLE_FILE, HMAC_FILE, "README.md", "netlify.toml"];
export const MAX_ARCHIVE_AGE_HOURS = 48;

export function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  return value;
}
export const canonicalJson = (value) => JSON.stringify(canonicalize(value));
export const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");

export function resolveKey(env = process.env) {
  const raw = env.CURRICULUM_ARCHIVE_ENCRYPTION_KEY?.trim() || env.BLOG_ARCHIVE_ENCRYPTION_KEY?.trim();
  if (!raw) throw new Error("No archive key: set CURRICULUM_ARCHIVE_ENCRYPTION_KEY (or the existing BLOG_ARCHIVE_ENCRYPTION_KEY). Generate with: openssl rand -base64 32");
  const key = Buffer.from(raw, "base64");
  if (key.length !== 32) throw new Error("Archive key must be 32 bytes encoded as base64 (openssl rand -base64 32).");
  return key;
}
const subkey = (key, label) => Buffer.from(hkdfSync("sha256", key, Buffer.alloc(0), `edunancial-curriculum-archive ${label}`, 32));

/**
 * Keyed digest of the archived CONTENT (objects + upload inventory), excluding
 * the export timestamp, so an unchanged curriculum produces the same digest and
 * the nightly job skips the commit. Reveals nothing without the key.
 */
export function bundleHmac(bundle, key) {
  const content = { format: bundle.format, files: bundle.files, inventory: bundle.inventory };
  return createHmac("sha256", subkey(key, "hmac")).update(canonicalJson(content), "utf8").digest("hex");
}

export function sealBundle(bundle, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", subkey(key, "enc"), iv);
  cipher.setAAD(MAGIC);
  const ciphertext = Buffer.concat([cipher.update(gzipSync(Buffer.from(canonicalJson(bundle), "utf8"), { level: 9 })), cipher.final()]);
  return Buffer.concat([MAGIC, iv, cipher.getAuthTag(), ciphertext]);
}

export function openBundle(buffer, key) {
  if (buffer.length < 36 || !buffer.subarray(0, 8).equals(MAGIC)) throw new Error("Not a curriculum archive bundle (bad header).");
  const decipher = createDecipheriv("aes-256-gcm", subkey(key, "enc"), buffer.subarray(8, 20));
  decipher.setAAD(MAGIC);
  decipher.setAuthTag(buffer.subarray(20, 36));
  let plain;
  try { plain = Buffer.concat([decipher.update(buffer.subarray(36)), decipher.final()]); }
  catch { throw new Error("Archive bundle failed authentication: wrong key, or the file was altered."); }
  return JSON.parse(gunzipSync(plain).toString("utf8"));
}

export function hmacEquals(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

/**
 * Build the archive bundle from export pages. Fails closed on anything that
 * would make the backup incomplete or untrustworthy.
 */
export function buildBundle(pages) {
  if (!pages.length) throw new Error("No export pages received.");
  const totals = pages[0].totals;
  const files = {};
  const inventory = [];
  const problems = [];
  for (const page of pages) {
    for (const path of page.missing ?? []) problems.push(`listed but unreadable: ${path}`);
    for (const entry of page.entries) {
      if (entry.kind === "inventory") { inventory.push({ path: entry.path, size: entry.size, sha256: entry.sha256 }); continue; }
      if (entry.tooLarge) { problems.push(`object too large to export: ${entry.path} (${entry.size} bytes)`); continue; }
      if (typeof entry.contentBase64 !== "string") { problems.push(`archive object without content: ${entry.path}`); continue; }
      const content = Buffer.from(entry.contentBase64, "base64");
      if (content.length !== entry.size || sha256(content) !== entry.sha256) { problems.push(`checksum mismatch in transit: ${entry.path}`); continue; }
      if (files[entry.path]) { problems.push(`duplicate path: ${entry.path}`); continue; }
      files[entry.path] = { sha256: entry.sha256, size: entry.size, contentBase64: entry.contentBase64 };
    }
  }
  const archived = Object.keys(files).length;
  if (archived !== totals.archive) problems.push(`archived ${archived} objects but production listed ${totals.archive}`);
  if (inventory.length !== totals.inventory) problems.push(`inventoried ${inventory.length} uploads but production listed ${totals.inventory}`);
  if (archived === 0) problems.push("no curriculum objects archived; refusing to save an empty backup");
  if (problems.length) throw new Error(`Curriculum archive incomplete:\n- ${problems.join("\n- ")}`);
  const byPrefix = {};
  for (const path of Object.keys(files)) { const prefix = path.split("/")[0]; byPrefix[prefix] = (byPrefix[prefix] ?? 0) + 1; }
  return {
    format: "edunancial-curriculum-archive/1",
    manifest: { generatedAt: pages[0].generatedAt, archived, inventoried: inventory.length, byPrefix, totalBytes: Object.values(files).reduce((n, f) => n + f.size, 0) },
    files,
    inventory: inventory.sort((a, b) => a.path.localeCompare(b.path)),
  };
}

/** Verify every archived object against its recorded checksum. Returns a summary. */
export function verifyBundle(bundle, { now = new Date(), maxAgeHours = MAX_ARCHIVE_AGE_HOURS } = {}) {
  if (bundle?.format !== "edunancial-curriculum-archive/1") throw new Error("Unknown archive format.");
  const errors = [];
  for (const [path, file] of Object.entries(bundle.files)) {
    const content = Buffer.from(file.contentBase64, "base64");
    if (content.length !== file.size || sha256(content) !== file.sha256) errors.push(`corrupt: ${path}`);
  }
  if (Object.keys(bundle.files).length !== bundle.manifest.archived) errors.push("manifest count does not match archived objects");
  const ageHours = (now.getTime() - Date.parse(bundle.manifest.generatedAt)) / 3_600_000;
  if (!(ageHours <= maxAgeHours)) errors.push(`archive is ${Number.isFinite(ageHours) ? ageHours.toFixed(1) : "?"} hours old (limit ${maxAgeHours})`);
  if (errors.length) throw new Error(`Curriculum archive verification failed:\n- ${errors.join("\n- ")}`);
  return { archived: bundle.manifest.archived, inventoried: bundle.manifest.inventoried, ageHours, byPrefix: bundle.manifest.byPrefix };
}

/** Compare the archive with production metadata (paths + checksums only). */
export function compareWithProduction(bundle, metadataPages) {
  const live = new Map();
  for (const page of metadataPages) for (const entry of page.entries) if (entry.kind === "archive") live.set(entry.path, entry.sha256);
  const missingFromArchive = [...live.keys()].filter((path) => !bundle.files[path]).sort();
  const changedSinceArchive = [...live.entries()].filter(([path, hash]) => bundle.files[path] && bundle.files[path].sha256 !== hash).map(([path]) => path).sort();
  const goneFromProduction = Object.keys(bundle.files).filter((path) => !live.has(path)).sort();
  return { live: live.size, archived: Object.keys(bundle.files).length, missingFromArchive, changedSinceArchive, goneFromProduction };
}

/** Restore every archived object into an empty directory, mirroring the store layout. */
export function restoreBundle(bundle, root) {
  let restored = 0;
  for (const [path, file] of Object.entries(bundle.files)) {
    const target = normalize(join(root, path));
    if (!target.startsWith(normalize(root) + sep)) throw new Error(`Refusing to restore outside the target directory: ${path}`);
    const content = Buffer.from(file.contentBase64, "base64");
    if (sha256(content) !== file.sha256) throw new Error(`corrupt object during restore: ${path}`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    restored += 1;
  }
  return restored;
}
