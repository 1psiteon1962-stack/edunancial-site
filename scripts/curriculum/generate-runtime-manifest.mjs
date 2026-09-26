import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

const ROOT = process.cwd();
const COURSE_ROOT = join(ROOT, "content", "courses");
const CURRICULUM_ROOT = join(ROOT, "content", "curriculum");
// Written as plain JSON (not a TypeScript module) so the ~13 MB of lesson text is
// never compiled, type-checked or bundled by Next.js. It is read lazily at runtime
// by src/lib/curriculum/committed-translation-fallback.ts.
const OUTPUT = join(ROOT, "content", "generated", "curriculum-runtime-manifest.json");

function normalize(path) {
  return path.replaceAll("\\", "/").toLowerCase();
}

function isEnglish(name) {
  const normalized = name.trim().toLowerCase().replaceAll("-", "_");
  return normalized === "en" || normalized === "en_us";
}

function isRecoverableRuntimeAsset(path) {
  const normalized = normalize(path);

  // Legacy and current translations may be committed as JSON records under
  // content/courses. Bundle JSON for every level so completed translations do
  // not disappear merely because they predate canonical Markdown sidecars.
  if (normalized.endsWith(".json") && normalized.includes("/content/courses/") && /\/level-\d+\//u.test(normalized)) {
    return true;
  }

  if (!normalized.endsWith(".md")) return false;

  // Keep the existing recoverable canonical Level 2/3 sources.
  for (const level of [2, 3]) {
    const marker = `/level-${level}/`;
    if (!normalized.includes(marker)) continue;
    const rest = normalized.split(marker)[1] ?? "";
    const segments = rest.split("/").filter(Boolean);
    if (!segments.length) return false;
    if (level === 2 && (segments.length === 1 || isEnglish(segments[0] ?? ""))) return true;
    if (level === 3 && segments.length > 1 && isEnglish(segments[0] ?? "")) return true;
  }

  // Bundle committed localized course files so Netlify server functions do not
  // depend on runtime filesystem layout to discover translations.
  const courseLocale = normalized.match(/\/level-\d+\/([^/]+)\//u)?.[1];
  if (courseLocale && !isEnglish(courseLocale)) return true;

  // Bundle normalized curriculum sidecars such as BLACK-L1-001.es-ES.md.
  if (normalized.includes("/content/curriculum/") && /\.[a-z]{2}(?:-[a-z0-9]+)?\.md$/iu.test(path)) return true;

  return false;
}

function walk(dir, files = []) {
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, files);
    else if (isRecoverableRuntimeAsset(path)) files.push(path);
  }
  return files;
}

const courseRecords = walk(COURSE_ROOT)
  .sort((a, b) => a.localeCompare(b))
  .map((path) => ({
    path: `courses/${relative(COURSE_ROOT, path).replaceAll("\\", "/")}`,
    content: readFileSync(path, "utf8"),
  }));

const curriculumRecords = walk(CURRICULUM_ROOT)
  .sort((a, b) => a.localeCompare(b))
  .map((path) => ({
    path: `curriculum/${relative(CURRICULUM_ROOT, path).replaceAll("\\", "/")}`,
    content: readFileSync(path, "utf8"),
  }));

const records = [...courseRecords, ...curriculumRecords];

if (!records.length) throw new Error("No curriculum/runtime assets found for runtime manifest");

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(records), "utf8");

console.log(`[curriculum-runtime-manifest] bundled ${records.length} committed curriculum/runtime files`);
