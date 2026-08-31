import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { gunzipSync } from "node:zlib";

const ROOT = process.cwd();
const BUNDLE_DIR = join(ROOT, "curriculum", "translation-bundles", "l1");
const TRACKS = new Set(["GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"]);
const LESSON_ID = /^([A-Z]+)-L1-(\d{3})$/u;
const B64_PART = /^(.*\.json\.gz\.b64)\.part(\d+)$/u;

if (!existsSync(BUNDLE_DIR)) process.exit(0);

let bundles = 0;
let lessons = 0;

const directoryEntries = readdirSync(BUNDLE_DIR).sort();
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

const sources = [
  ...directoryEntries
    .filter((name) => name.endsWith(".json") || name.endsWith(".json.gz"))
    .map((name) => ({ name, read: () => {
      const raw = readFileSync(join(BUNDLE_DIR, name));
      return name.endsWith(".gz") ? gunzipSync(raw).toString("utf8") : raw.toString("utf8");
    } })),
  ...[...chunkGroups.entries()].map(([name, parts]) => ({
    name,
    read: () => {
      const encoded = parts
        .sort((a, b) => a.part - b.part)
        .map(({ name: partName }) => readFileSync(join(BUNDLE_DIR, partName), "utf8").trim())
        .join("");
      return gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
    },
  })),
].sort((a, b) => a.name.localeCompare(b.name));

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

console.log(`[l1-localization] installed ${lessons} localized lesson files from ${bundles} bundles`);
