import assert from "node:assert/strict";
import test from "node:test";

import type { PublishedLessonRecord } from "@/lib/curriculum/authoritative-published";
import { isLearnerReadyTranslation } from "@/lib/curriculum/translation-quality";

const lesson: PublishedLessonRecord = {
  id: "BLUE-L2-001",
  track: "BLUE",
  trackName: "Business",
  level: 2,
  lessonNumber: 1,
  title: "From Idea to Entity",
  summary: "Canonical summary",
  author: "Edunancial Faculty",
  date: "2026-09-15",
  version: "1.0",
  status: "active",
  importedAt: "2026-09-15T00:00:00.000Z",
  metadata: {},
  path: "content/curriculum/BLUE/L2/BLUE-L2-001.md",
  body: "Canonical English lesson ".repeat(250),
  frontMatter: {},
};

test("existing Level 2 localized lessons are not hidden solely because they are shorter than English", () => {
  assert.equal(
    isLearnerReadyTranslation(lesson, {
      title: "Unternehmerische Kompetenz 1",
      summary: "Lokalisierte Zusammenfassung",
      body: "Diese Lektion entwickelt praktische unternehmerische Kompetenz und angewandtes Denken.",
    }),
    true,
  );
});

test("explicit legacy placeholder translations remain blocked", () => {
  assert.equal(
    isLearnerReadyTranslation(lesson, {
      title: "Placeholder",
      body: "Localized curriculum content for BLUE-L2-001",
    }),
    false,
  );
});

test("translations without a body remain blocked", () => {
  assert.equal(isLearnerReadyTranslation(lesson, { title: "Nur Titel" }), false);
});
