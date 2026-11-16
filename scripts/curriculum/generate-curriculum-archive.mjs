// Packs every committed file under content/curriculum and content/courses into one
// archive that the deployed server reads when the raw files are not on disk.
//
// Format (v2, random access): "EDUARCH2" + uint32 BE header length + JSON header
// {version, roots, files:[[path, offset, length, binary]]} + the files, each gzipped
// on its own. The server reads only the small header up front and inflates a single
// file per read, so memory stays at the level of reading raw files from disk. (v1
// gzipped one big JSON document, which the server had to inflate and parse whole;
// that cost hundreds of MB per cold start and made heavy routes crash with 502s.)
//
// Why: the Netlify server handler must stay under the AWS Lambda 250 MB (unzipped)
// limit. Shipping ~120 MB of raw lesson Markdown/JSON pushed it over that limit once
// Level 4 translations were added. The gzipped archive carries the same bytes in about
// a quarter of the space. Git remains the curriculum source of truth: this script only
// reads committed files and never adds, removes, renames or edits a lesson.
//
// Runtime counterpart: src/lib/curriculum/curriculum-fs.ts (disk first, archive second).
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = process.cwd();
export const ARCHIVED_ROOTS = ["content/curriculum", "content/courses"];
const OUTPUT = join(ROOT, "content", "generated", "curriculum-archive.bin");
const LEGACY_OUTPUT = join(ROOT, "content", "generated", "curriculum-archive.json.gz");

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function isUtf8Text(buffer) {
  try {
    new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    return !buffer.includes(0);
  } catch {
    return false;
  }
}

const entries = [];
const chunks = [];
let offset = 0;
let bytes = 0;
for (const root of ARCHIVED_ROOTS) {
  for (const absolute of walk(join(ROOT, root)).sort((a, b) => a.localeCompare(b))) {
    const buffer = readFileSync(absolute);
    bytes += buffer.length;
    const path = relative(ROOT, absolute).replaceAll("\\", "/");
    const packed = gzipSync(buffer, { level: 9 });
    entries.push([path, offset, packed.length, isUtf8Text(buffer) ? 0 : 1]);
    chunks.push(packed);
    offset += packed.length;
  }
}

const markdown = entries.filter(([path]) => path.endsWith(".md")).length;
if (!markdown) {
  console.error("[curriculum-archive] refusing to write an archive with no lesson Markdown");
  process.exit(1);
}

const header = Buffer.from(JSON.stringify({ version: 2, roots: ARCHIVED_ROOTS, files: entries }), "utf8");
const length = Buffer.alloc(4);
length.writeUInt32BE(header.length, 0);
const archive = Buffer.concat([Buffer.from("EDUARCH2", "ascii"), length, header, ...chunks]);
mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, archive);
rmSync(LEGACY_OUTPUT, { force: true });
console.log(
  `[curriculum-archive] archived ${entries.length} files (${markdown} Markdown, ${(bytes / 1e6).toFixed(1)} MB) into ${(archive.length / 1e6).toFixed(1)} MB (header ${(header.length / 1e6).toFixed(2)} MB)`,
);
