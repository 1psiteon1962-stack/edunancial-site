import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const store = readFileSync(path.join(process.cwd(), "src/lib/curriculum/translation-package-store.ts"), "utf8");
const published = readFileSync(path.join(process.cwd(), "src/lib/curriculum/authoritative-published.ts"), "utf8");

test("learner track reads only translation packages for the requested locale", () => {
  assert.match(store, /readTranslationPackagesForLocale/);
  assert.match(published, /readTranslationPackagesForLocale\(locale\)/);
});

test("learner lesson reads only the package for its lesson coordinate", () => {
  assert.match(store, /readTranslationPackageForLesson/);
  assert.match(published, /readTranslationPackageForLesson\(lessonId,locale\)/);
  assert.doesNotMatch(published, /getPublishedLesson[^\n]+readTranslationPackages\(\)/u);
});
