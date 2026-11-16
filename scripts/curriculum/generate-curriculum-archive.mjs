// Packs every committed file under content/curriculum and content/courses into one
// gzipped archive that the deployed server reads when the raw files are not on disk.
//
// Why: the Netlify server handler must stay under the AWS Lambda 250 MB (unzipped)
// limit. Shipping ~120 MB of raw lesson Markdown/JSON pushed it over that limit once
// Level 4 translations were added. The gzipped archive carries the same bytes in about
// a quarter of the space. Git remains the curriculum source of truth: this script only
// reads committed files and never adds, removes, renames or edits a lesson.
//
// Runtime counterpart: src/lib/curriculum/curriculum-fs.ts (disk first, archive second).
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = process.cwd();
export const ARCHIVED_ROOTS = ["content/curriculum", "content/courses"];
const OUTPUT = join(ROOT, "content", "generated", "curriculum-archive.json.gz");

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

const records = [];
let bytes = 0;
for (const root of ARCHIVED_ROOTS) {
  for (const absolute of walk(join(ROOT, root)).sort((a, b) => a.localeCompare(b))) {
    const buffer = readFileSync(absolute);
    bytes += buffer.length;
    const path = relative(ROOT, absolute).replaceAll("\\", "/");
    records.push(
      isUtf8Text(buffer)
        ? { path, content: buffer.toString("utf8") }
        : { path, content: buffer.toString("base64"), encoding: "base64" },
    );
  }
}

const markdown = records.filter((record) => record.path.endsWith(".md")).length;
if (!markdown) {
  console.error("[curriculum-archive] refusing to write an archive with no lesson Markdown");
  process.exit(1);
}

mkdirSync(dirname(OUTPUT), { recursive: true });
const gz = gzipSync(Buffer.from(JSON.stringify({ version: 1, roots: ARCHIVED_ROOTS, files: records })), { level: 9 });
writeFileSync(OUTPUT, gz);
console.log(
  `[curriculum-archive] archived ${records.length} files (${markdown} Markdown, ${(bytes / 1e6).toFixed(1)} MB) into ${(gz.length / 1e6).toFixed(1)} MB`,
);
