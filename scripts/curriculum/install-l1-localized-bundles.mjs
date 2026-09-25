import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync, inflateRawSync } from "node:zlib";

const ROOT = process.cwd();
const BUNDLE_DIR = join(ROOT, "curriculum", "translation-bundles", "l1");
const LEGACY_BUNDLE_DIRS = [
  join(ROOT, "content", "courses", "gold", "level-1", "en"),
];
const TRACKS = new Set(["BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"]);
const LESSON_ID = /^([A-Z]+)-L1-(\d{3})$/u;
const B64_PART = /^(.*\.json\.gz\.b64)\.part(\d+)$/u;

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

  if (raw.length - offset > 8) {
    try {
      return inflateRawSync(raw.subarray(offset, raw.length - 8)).toString("utf8");
    } catch {}
  }
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
      if (Array.isArray(parsed.lessons) && parsed.lessons.length === 50) return json;
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

function fieldFromFrontMatter(markdown, field, fallback = "") {
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
    if (line.length >= 40) return line.replace(/^\\*+|\\*+$/gu, "").trim();
  }
  return title;
}

function normalizeRecoveredMarkdown(markdown, id, track, locale, canonicalPath) {
  if (markdown.trim().startsWith("---")) return markdown;
  const canonical = readFileSync(canonicalPath, "utf8");
  const title = recoveredTitle(markdown, id);
  const summary = recoveredSummary(markdown, title);
  const lessonNumber = Number(id.slice(-3));
  const officialTrackName = fieldFromFrontMatter(canonical, "officialTrackName", track);
  const version = fieldFromFrontMatter(canonical, "version", "1.0");
  const author = fieldFromFrontMatter(canonical, "author", "Waldemar M. Caban, JD MA");
  const date = fieldFromFrontMatter(canonical, "date", "2026-08-09");
  const frontMatter = [
    "---",
    "id: " + id,
    "track: " + track,
    "officialTrackName: " + yamlString(officialTrackName),
    "level: 1",
    "lessonNumber: " + lessonNumber,
    "locale: " + locale,
    "title: " + yamlString(title),
    "summary: " + yamlString(summary),
    "version: " + yamlString(version),
    "author: " + yamlString(author),
    "date: " + date,
    "---",
    "",
  ].join("\\n");
  return frontMatter + markdown.trim() + "\\n";
}

for (const source of sources) {
  const filename = source.name;
  const parsed = JSON.parse(source.read());
  const track = String(parsed.track ?? "").toUpperCase();
  const locale = String(parsed.locale ?? "").trim();
  const records = Array.isArray(parsed.lessons) ? parsed.lessons : [];

  if (!TRACKS.has(track)) throw new Error(`${filename}: unsupported track ${track}`);
  if (!/^[a-z]{2}(?:-[A-Za-z]{2,})?$/u.test(locale)) throw new Error(`${filename}: invalid locale ${locale}`);
  if (records.length !== 50) throw new Error(`${filename}: expected 50 lessons, found ${records.length}`);

  const ids = new Set();
  for (const record of records) {
    const id = String(record.id ?? "").toUpperCase();
    const match = id.match(LESSON_ID);
    if (!match || match[1] !== track) throw new Error(`${filename}: invalid lesson id ${id}`);
    if (ids.has(id)) throw new Error(`${filename}: duplicate lesson ${id}`);
    ids.add(id);

    const destinationDir = join(ROOT, "content", "curriculum", track, "L1");
    const canonicalPath = join(destinationDir, `${id}.md`);
    if (!existsSync(canonicalPath)) throw new Error(`${filename}: canonical lesson missing ${id}`);
    const markdown = normalizeRecoveredMarkdown(String(record.markdown ?? ""), id, track, locale, canonicalPath);

    if (!/^title:\s*.+$/mu.test(markdown)) throw new Error(`${filename}: ${id} missing title`);
    if (!/^summary:\s*.+$/mu.test(markdown)) throw new Error(`${filename}: ${id} missing summary`);
    const bodyEnd = markdown.indexOf("\n---", 4);
    if (bodyEnd < 0 || !markdown.slice(bodyEnd + 4).trim()) throw new Error(`${filename}: ${id} missing body`);

    mkdirSync(destinationDir, { recursive: true });
    writeFileSync(join(destinationDir, `${id}.${locale}.md`), markdown.endsWith("\n") ? markdown : `${markdown}\n`, "utf8");
    lessons += 1;
  }
  bundles += 1;
}

console.log(`[l1-localization] installed ${lessons} localized lesson files from ${bundles} bundles`);
