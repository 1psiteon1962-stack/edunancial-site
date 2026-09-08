import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const COURSES = path.join(ROOT, "content", "courses");
const FULL_BUNDLE_RE = /full[-_ ]?50[-_ ]?lessons/i;
const LESSON_HEADING_RE = /^##\s+([A-Z][A-Z0-9]*-L([1-9][0-9]*)-([0-9]{3}))\s*$/gm;

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function validateBundle(file) {
  const relative = path.relative(ROOT, file).replaceAll(path.sep, "/");
  const text = fs.readFileSync(file, "utf8");
  const matches = [...text.matchAll(LESSON_HEADING_RE)];
  const errors = [];

  if (matches.length !== 50) {
    errors.push(`${relative}: expected exactly 50 lesson headings, found ${matches.length}.`);
    return errors;
  }

  const ids = matches.map((match) => match[1]);
  const unique = new Set(ids);
  if (unique.size !== 50) errors.push(`${relative}: duplicate lesson IDs detected.`);

  const track = ids[0]?.split("-")[0];
  const level = matches[0]?.[2];
  for (let number = 1; number <= 50; number += 1) {
    const expected = `${track}-L${level}-${String(number).padStart(3, "0")}`;
    if (!unique.has(expected)) errors.push(`${relative}: missing ${expected}.`);
  }

  for (let index = 0; index < matches.length; index += 1) {
    const start = matches[index].index ?? 0;
    const end = matches[index + 1]?.index ?? text.length;
    const section = text.slice(start, end);
    for (let sectionNumber = 1; sectionNumber <= 7; sectionNumber += 1) {
      const marker = new RegExp(`\\*\\*${sectionNumber}\\.\\s+[^*]+\\*\\*`, "m");
      if (!marker.test(section)) {
        errors.push(`${relative}: ${matches[index][1]} is missing required section ${sectionNumber}.`);
      }
    }
  }

  return errors;
}

const bundles = walk(COURSES).filter((file) => file.endsWith(".md") && FULL_BUNDLE_RE.test(path.basename(file)));
if (bundles.length === 0) {
  console.log("No full-50 curriculum bundles found.");
  process.exit(0);
}

const errors = bundles.flatMap(validateBundle);
if (errors.length > 0) {
  console.error(`Full curriculum bundle validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validated ${bundles.length} full-50 curriculum bundle(s): exactly 50 unique lessons with all seven required sections.`);
