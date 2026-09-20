#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "content", "generated", "translation-manifest.json");
const outputDir = join(root, "content", "generated", "translation-batches");

const locale = (process.env.EDUNANCIAL_TRANSLATION_LOCALE || process.argv[2] || "").trim();
const track = (process.env.EDUNANCIAL_TRANSLATION_TRACK || "").trim().toUpperCase();
const requestedLevel = (process.env.EDUNANCIAL_TRANSLATION_LEVEL || "all").trim().toLowerCase();
const limit = Math.max(1, Number(process.env.EDUNANCIAL_TRANSLATION_LIMIT || "50") || 50);
const offset = Math.max(0, Number(process.env.EDUNANCIAL_TRANSLATION_OFFSET || "0") || 0);

if (!locale) throw new Error("Set EDUNANCIAL_TRANSLATION_LOCALE or pass a locale argument.");
if (!existsSync(manifestPath)) {
  throw new Error("translation-manifest.json is missing; run npm run curriculum:localization:global first.");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const lessons = manifest.lessons && typeof manifest.lessons === "object" ? manifest.lessons : {};

function parseLessonId(id) {
  const match = String(id).toUpperCase().match(/^([A-Z]+)-L(\d+)-(\d{3})$/u);
  if (!match) return null;
  return { track: match[1], level: Number(match[2]), lessonNumber: Number(match[3]) };
}

const requestedLevelNumber = requestedLevel === "all" ? null : Number(requestedLevel);
if (requestedLevelNumber !== null && (!Number.isInteger(requestedLevelNumber) || requestedLevelNumber < 1 || requestedLevelNumber > 5)) {
  throw new Error(`Unsupported curriculum level: ${requestedLevel}`);
}

const candidates = Object.entries(lessons)
  .map(([id, lesson]) => ({ id, lesson, parsed: parseLessonId(id) }))
  .filter((item) => item.parsed && item.lesson?.canonical)
  .filter((item) => !track || item.parsed.track === track)
  .filter((item) => requestedLevelNumber === null || item.parsed.level === requestedLevelNumber)
  .filter((item) => {
    const translation = item.lesson.translations?.[locale];
    return !(translation?.status === "published" && !translation?.stale);
  })
  .sort((a, b) =>
    a.parsed.track.localeCompare(b.parsed.track) ||
    a.parsed.level - b.parsed.level ||
    a.parsed.lessonNumber - b.parsed.lessonNumber
  );

const selected = candidates.slice(offset, offset + limit);
const jobs = selected.map((item) => {
  const canonicalPath = item.lesson.canonical.path;
  const absolutePath = join(root, canonicalPath);
  const source = readFileSync(absolutePath, "utf8");
  const existing = item.lesson.translations?.[locale] ?? null;
  return {
    lessonId: item.id,
    track: item.parsed.track,
    level: item.parsed.level,
    lessonNumber: item.parsed.lessonNumber,
    locale,
    canonicalPath,
    canonicalVersion: item.lesson.canonical.version ?? null,
    reason: existing?.stale ? "stale" : "missing",
    existingTranslationPath: existing?.path ?? null,
    sourceMarkdown: source,
  };
});

const batch = {
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  locale,
  filters: {
    track: track || "ALL",
    level: requestedLevelNumber ?? "ALL",
    offset,
    limit,
  },
  totalMatchingJobs: candidates.length,
  batchJobCount: jobs.length,
  remainingAfterBatch: Math.max(0, candidates.length - offset - jobs.length),
  instructions: [
    "Translate each complete sourceMarkdown lesson into the requested locale.",
    "Preserve lesson ID, Markdown structure, headings, lists, examples, case studies, quiz questions, answer keys, warnings, factual qualifiers, numbers, formulas, URLs, and author meaning.",
    "Do not summarize, omit sections, add investment advice, or leave English instructional prose.",
    "Return one complete translated Markdown file per lesson using normalized path content/curriculum/<TRACK>/L<LEVEL>/<LESSON>.<locale>.md.",
    "Include YAML front matter with id, track, level, lessonNumber, locale, title, and summary.",
  ],
  jobs,
};

mkdirSync(outputDir, { recursive: true });
const safeLocale = locale.replace(/[^A-Za-z0-9_-]/gu, "_");
const safeTrack = track || "ALL";
const safeLevel = requestedLevelNumber ?? "ALL";
const outputPath = join(outputDir, `${safeTrack}-L${safeLevel}-${safeLocale}-offset-${offset}.json`);
writeFileSync(outputPath, `${JSON.stringify(batch, null, 2)}\n`, "utf8");
console.log(`Translation batch: ${jobs.length} job(s) written to ${outputPath}`);
console.log(`Matching jobs: ${candidates.length}; remaining after batch: ${batch.remainingAfterBatch}`);
