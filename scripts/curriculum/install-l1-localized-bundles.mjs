import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { gunzipSync, inflateRawSync } from "node:zlib";
import { extractZip } from "./lib/zip.mjs";

const ROOT = process.cwd();
const BUNDLE_DIR = join(ROOT, "curriculum", "translation-bundles", "l1");
const LEGACY_BUNDLE_DIRS = [
  join(ROOT, "content", "courses", "gold", "level-1", "en"),
];
const TRACKS = new Set(["BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"]);
const LESSON_ID = /^([A-Z]+)-L1-(\d{3})$/u;
const B64_PART = /^(.*\.json\.gz\.b64)\.part(\d+)$/u;
const RECOVERY_ZIP_B64 = /^([a-z]+)-l1-(.+)\.zip\.b64$/u;

const bundleDirs = [BUNDLE_DIR].filter((dir) => existsSync(dir));
if (!bundleDirs.length) process.exit(0);

let bundles = 0;
let lessons = 0;

const directoryEntries = existsSync(BUNDLE_DIR) ? readdirSync(BUNDLE_DIR).sort() : [];
const chunkGroups = new Map();
for (const name of directoryEntries) {
  const match = name.match(B64_PART);
  if (!match) continue;
  const key = match[1];
  const part = Number(match[2]);
  const list = chunkGroups.get(key) ?? [];
  list.push({ name, part });
  chunkGroups.set(key, list);
}

function inflateGzipPayloadIgnoringTrailer(raw, filename) {
  if (raw.length < 10 || raw[0] !== 0x1f || raw[1] !== 0x8b || raw[2] !== 8) {
    throw new Error(`${filename}: invalid gzip structure`);
  }

  const flags = raw[3];
  if ((flags & 0xe0) !== 0) throw new Error(`${filename}: invalid gzip flags`);

  let offset = 10;
  const payloadLimit = raw.length;

  if ((flags & 0x04) !== 0) {
    if (offset + 2 > payloadLimit) throw new Error(`${filename}: truncated gzip extra header`);
    const extraLength = raw.readUInt16LE(offset);
    offset += 2 + extraLength;
  }

  const skipZeroTerminated = (label) => {
    while (offset < payloadLimit && raw[offset] !== 0) offset += 1;
    if (offset >= payloadLimit) throw new Error(`${filename}: truncated gzip ${label}`);
    offset += 1;
  };

  if ((flags & 0x08) !== 0) skipZeroTerminated("filename");
  if ((flags & 0x10) !== 0) skipZeroTerminated("comment");
  if ((flags & 0x02) !== 0) offset += 2;

  if (offset >= payloadLimit) throw new Error(`${filename}: missing gzip deflate payload`);

  // First try the normal no-checksum path (strip an 8-byte trailer when present).
  if (raw.length - offset > 8) {
    try {
      return inflateRawSync(raw.subarray(offset, raw.length - 8)).toString("utf8");
    } catch {}
  }
  // Historical bundles may have a truncated/missing gzip trailer while the deflate
  // stream itself is still complete. zlib accepts trailing bytes, so inflate the
  // remaining payload directly as a final recovery path.
  return inflateRawSync(raw.subarray(offset)).toString("utf8");
}

function gunzipBundle(raw, filename, { allowChecksumRecovery = false } = {}) {
  let decoded = raw;
  if (!(raw.length >= 2 && raw[0] === 0x1f && raw[1] === 0x8b)) {
    const encoded = raw.toString("utf8").replace(/\s+/gu, "");
    if (!encoded || !/^[A-Za-z0-9+/]+={0,2}$/u.test(encoded)) {
      throw new Error(`${filename}: expected gzip bytes or base64-encoded gzip text`);
    }

    decoded = Buffer.from(encoded, "base64");
    if (decoded.length < 2 || decoded[0] !== 0x1f || decoded[1] !== 0x8b) {
      throw new Error(`${filename}: base64 payload is not gzip data`);
    }
  }

  try {
    return gunzipSync(decoded).toString("utf8");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (!allowChecksumRecovery || !/incorrect data check|incorrect length check|unexpected end of file/iu.test(message)) throw error;
    return inflateGzipPayloadIgnoringTrailer(decoded, filename);
  }
}

function readChunkedBundle(name, parts) {
  const sorted = [...parts].sort((a, b) => a.part - b.part);
  let encoded = "";
  let lastError = null;

  for (const { name: partName } of sorted) {
    encoded += readFileSync(join(BUNDLE_DIR, partName), "utf8").trim();
    if (encoded.length % 4 !== 0) continue;
    try {
      const json = gunzipBundle(Buffer.from(encoded, "utf8"), name, { allowChecksumRecovery: true });
      const parsed = JSON.parse(json);
      const validSingle = Array.isArray(parsed.lessons) && parsed.lessons.length === 50;
      const validMulti = Array.isArray(parsed.bundles) && parsed.bundles.length > 0 &&
        parsed.bundles.every((bundle) => Array.isArray(bundle.lessons) && bundle.lessons.length === 50);
      if (validSingle || validMulti) return json;
    } catch (error) {
      lastError = error;
    }
  }

  throw new Error(`${name}: no valid 50-lesson gzip payload found in chunk prefix${lastError ? ` (${lastError.message})` : ""}`);
}

const sources = [
  ...bundleDirs.flatMap((dir) =>
    readdirSync(dir)
      .filter((name) => name.endsWith(".json") || name.endsWith(".json.gz"))
      .map((name) => ({ name, read: () => {
        const raw = readFileSync(join(dir, name));
        return name.endsWith(".gz") ? gunzipBundle(raw, name, { allowChecksumRecovery: true }) : raw.toString("utf8");
      } }))
  ),
  ...[...chunkGroups.entries()].map(([name, parts]) => ({
    name,
    read: () => readChunkedBundle(name, parts),
  })),
].sort((a, b) => a.name.localeCompare(b.name));

function yamlString(value) {
  return JSON.stringify(String(value ?? "").trim());
}

function frontMatterField(markdown, field, fallback = "") {
  const match = markdown.match(new RegExp("^" + field + ":\\s*(.+)$", "mu"));
  if (!match) return fallback;
  const raw = match[1].trim();
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1);
  }
  return raw;
}

function recoveredTitle(markdown, id) {
  const heading = markdown.match(/^#\\s+(.+)$/mu)?.[1]?.trim() ?? id;
  return heading.replace(new RegExp("^" + id + "\\s*:\\s*", "iu"), "").trim() || id;
}

function recoveredSummary(markdown, title) {
  const lines = markdown.split(/\\r?\\n/u).map((line) => line.trim());
  for (const line of lines) {
    if (!line || line.startsWith("#") || /^[-*>]/u.test(line) || /^\\d+[.)]\\s/u.test(line)) continue;
    const cleaned = line.replaceAll("*", "").trim();
    if (cleaned.length >= 50) return cleaned;
  }
  return title;
}

function normalizeRecoveredMarkdown(markdown, id, track, locale, canonicalPath) {
  const canonical = readFileSync(canonicalPath, "utf8");
  const canonicalOfficialName = frontMatterField(canonical, "officialTrackName", track);
  const canonicalVersion = frontMatterField(canonical, "version", "1.0");
  const canonicalAuthor = frontMatterField(canonical, "author", "Waldemar M. Caban, JD MA");
  const canonicalDate = frontMatterField(canonical, "date", "2026-08-09");

  let body = markdown.trim();
  let title = "";
  let summary = "";
  let officialTrackName = canonicalOfficialName;
  let version = canonicalVersion;
  let author = canonicalAuthor;
  let date = canonicalDate;

  if (body.startsWith("---")) {
    const end = body.indexOf("\n---", 4);
    if (end > 0) {
      const frontMatter = body.slice(4, end);
      const originalBody = body.slice(end + 4).trim();
      title = frontMatterField(frontMatter, "title", "");
      summary = frontMatterField(frontMatter, "summary", "");
      officialTrackName = frontMatterField(frontMatter, "officialTrackName", canonicalOfficialName);
      version = frontMatterField(frontMatter, "version", canonicalVersion);
      author = frontMatterField(frontMatter, "author", canonicalAuthor);
      date = frontMatterField(frontMatter, "date", canonicalDate);
      body = originalBody;
    }
  }

  title ||= recoveredTitle(body, id);
  summary ||= recoveredSummary(body, title);

  const frontMatter = [
    "---",
    `id: ${id}`,
    `track: ${track}`,
    `officialTrackName: ${yamlString(officialTrackName)}`,
    "level: 1",
    `lessonNumber: ${Number(id.slice(-3))}`,
    `title: ${yamlString(title)}`,
    `summary: ${yamlString(summary)}`,
    `locale: ${yamlString(locale)}`,
    `version: ${yamlString(version)}`,
    `author: ${yamlString(author)}`,
    `date: ${date}`,
    "---",
    "",
  ].join("\n");

  return `${frontMatter}${body}\n`;
}

function installRecoveryZip(filename) {
  const match = filename.match(RECOVERY_ZIP_B64);
  if (!match) return;

  const track = match[1].toUpperCase();
  const locale = match[2];
  if (!TRACKS.has(track)) throw new Error(`${filename}: unsupported track ${track}`);
  if (!/^[a-z]{2}(?:-[A-Za-z]{2,})?$/u.test(locale)) throw new Error(`${filename}: invalid locale ${locale}`);

  const encoded = readFileSync(join(BUNDLE_DIR, filename), "utf8").replace(/\\s+/gu, "");
  const entries = extractZip(Buffer.from(encoded, "base64"));
  const records = new Map();

  for (const entry of entries) {
    if (!entry.name.toLowerCase().endsWith(".md")) continue;
    const idMatch = basename(entry.name).match(new RegExp("^(" + track + "-L1-\\d{3})(?:[-.].*)?\\.md$", "iu"));
    if (!idMatch) continue;
    const id = idMatch[1].toUpperCase();
    if (records.has(id)) throw new Error(`${filename}: duplicate lesson ${id}`);
    records.set(id, entry.data.toString("utf8"));
  }

  if (records.size !== 50) throw new Error(`${filename}: expected 50 lessons, found ${records.size}`);

  for (let number = 1; number <= 50; number += 1) {
    const id = `${track}-L1-${String(number).padStart(3, "0")}`;
    const rawMarkdown = records.get(id);
    if (!rawMarkdown) throw new Error(`${filename}: missing lesson ${id}`);

    const destinationDir = join(ROOT, "content", "curriculum", track, "L1");
    const canonicalPath = join(destinationDir, `${id}.md`);
    if (!existsSync(canonicalPath)) throw new Error(`${filename}: canonical lesson missing ${id}`);
    const markdown = normalizeRecoveredMarkdown(rawMarkdown, id, track, locale, canonicalPath);

    if (!/^title:\\s*.+$/mu.test(markdown)) throw new Error(`${filename}: ${id} missing title`);
    if (!/^summary:\\s*.+$/mu.test(markdown)) throw new Error(`${filename}: ${id} missing summary`);

    mkdirSync(destinationDir, { recursive: true });
    writeFileSync(join(destinationDir, `${id}.${locale}.md`), markdown, "utf8");
    lessons += 1;
  }
  bundles += 1;
}

for (const source of sources) {
  const filename = source.name;
  const parsed = JSON.parse(source.read());
  const sourceBundles = Array.isArray(parsed.bundles) ? parsed.bundles : [parsed];

  for (const bundle of sourceBundles) {
    const track = String(bundle.track ?? "").toUpperCase();
    const locale = String(bundle.locale ?? "").trim();
    const records = Array.isArray(bundle.lessons) ? bundle.lessons : [];

    if (!TRACKS.has(track)) throw new Error(`${filename}: unsupported track ${track}`);
    if (!/^[a-z]{2}(?:-[A-Za-z]{2,})?$/u.test(locale)) throw new Error(`${filename}: invalid locale ${locale}`);
    if (records.length !== 50) throw new Error(`${filename}: expected 50 lessons, found ${records.length}`);

    const ids = new Set();
    for (const record of records) {
      const id = String(record.id ?? "").toUpperCase();
      const markdown = String(record.markdown ?? "");
      const match = id.match(LESSON_ID);
      if (!match || match[1] !== track) throw new Error(`${filename}: invalid lesson id ${id}`);
      if (ids.has(id)) throw new Error(`${filename}: duplicate lesson ${id}`);
      ids.add(id);

      if (!markdown.trim().startsWith("---")) throw new Error(`${filename}: ${id} missing front matter`);
      if (!/^title:\s*.+$/mu.test(markdown)) throw new Error(`${filename}: ${id} missing title`);
      if (!/^summary:\s*.+$/mu.test(markdown)) throw new Error(`${filename}: ${id} missing summary`);
      const bodyEnd = markdown.indexOf("\n---", 4);
      if (bodyEnd < 0 || !markdown.slice(bodyEnd + 4).trim()) throw new Error(`${filename}: ${id} missing body`);

      const destinationDir = join(ROOT, "content", "curriculum", track, "L1");
      const canonicalPath = join(destinationDir, `${id}.md`);
      if (!existsSync(canonicalPath)) throw new Error(`${filename}: canonical lesson missing ${id}`);
      mkdirSync(destinationDir, { recursive: true });
      writeFileSync(join(destinationDir, `${id}.${locale}.md`), markdown.endsWith("\n") ? markdown : `${markdown}\n`, "utf8");
      lessons += 1;
    }
    bundles += 1;
  }
}

for (const filename of directoryEntries.filter((name) => name.endsWith(".zip.b64"))) {
  installRecoveryZip(filename);
}

console.log(`[l1-localization] installed ${lessons} localized lesson files from ${bundles} bundles`);
