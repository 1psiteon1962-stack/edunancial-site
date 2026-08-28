#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const manifestPath = join(root, "content", "generated", "translation-manifest.json");
const outputPath = join(root, "content", "generated", "translation-workqueue.json");

if (!existsSync(manifestPath)) {
  throw new Error("translation-manifest.json is missing; run curriculum:localization:global first");
}

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const lessons = manifest.lessons && typeof manifest.lessons === "object" ? manifest.lessons : {};
const locales = manifest.coverage && typeof manifest.coverage === "object" ? Object.keys(manifest.coverage) : [];

function parseLessonId(id) {
  const match = String(id).toUpperCase().match(/^([A-Z]+)-L(\d+)-(\d{3})$/u);
  if (!match) return { track: "UNKNOWN", level: null, number: null };
  return { track: match[1], level: Number(match[2]), number: Number(match[3]) };
}

const canonicalLessons = Object.entries(lessons)
  .filter(([, lesson]) => lesson?.canonical)
  .map(([id, lesson]) => ({ id, lesson, ...parseLessonId(id) }))
  .sort((a, b) => a.track.localeCompare(b.track) || (a.level ?? 0) - (b.level ?? 0) || (a.number ?? 0) - (b.number ?? 0));

const byLocale = {};
const byTrack = {};
const jobs = [];

for (const locale of locales) {
  const missing = [];
  for (const item of canonicalLessons) {
    const translation = item.lesson.translations?.[locale];
    if (translation?.status === "published" && !translation?.stale) continue;

    const reason = translation?.stale ? "stale" : "missing";
    const job = {
      lessonId: item.id,
      locale,
      track: item.track,
      level: item.level,
      lessonNumber: item.number,
      reason,
      canonicalPath: item.lesson.canonical?.path ?? null,
      canonicalVersion: item.lesson.canonical?.version ?? null,
      existingTranslationPath: translation?.path ?? null,
    };
    missing.push(job);
    jobs.push(job);

    byTrack[item.track] ??= {};
    byTrack[item.track][locale] ??= [];
    byTrack[item.track][locale].push(job);
  }

  byLocale[locale] = {
    missingCount: missing.length,
    completeCount: canonicalLessons.length - missing.length,
    canonicalCount: canonicalLessons.length,
    jobs: missing,
  };
}

const output = {
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  sourceManifestGeneratedAt: manifest.generatedAt ?? null,
  canonicalLessonCount: canonicalLessons.length,
  localeCount: locales.length,
  jobCount: jobs.length,
  byLocale,
  byTrack,
  jobs,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Translation work queue: ${output.jobCount} missing/stale lesson-locale jobs across ${output.localeCount} locales.`);
