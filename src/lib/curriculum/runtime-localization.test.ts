import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { PublishedLessonRecord } from "@/lib/curriculum/authoritative-published";
import {
  addHistoricalTranslation,
  applyHistoricalTranslation,
  resolveHistoricalTranslation,
} from "@/lib/curriculum/runtime-localization";

function index() {
  return {
    version: 1,
    builtAt: "2026-08-30T00:00:00.000Z",
    batchCount: 0,
    translationCount: 0,
    translations: {},
  };
}

const lesson: PublishedLessonRecord = {
  id: "BLACK-L1-001",
  track: "BLACK",
  trackName: "Leadership & Executive Management",
  level: 1,
  lessonNumber: 1,
  title: "English title",
  summary: "English summary",
  author: "Edunancial Faculty",
  date: "2026-08-30",
  version: "1.0",
  status: "active",
  importedAt: "2026-08-30T00:00:00.000Z",
  metadata: {},
  path: "content/curriculum/BLACK/L1/BLACK-L1-001.md",
  body: "English body",
  frontMatter: {},
};

describe("runtime curriculum localization", () => {
  it("restores a complete regional translation from historical uploads", () => {
    const value = index();
    addHistoricalTranslation(value, lesson.id, "es-Caribbean", {
      title: "Titulo en espanol",
      summary: "Resumen en espanol",
      body: "Cuerpo completo en espanol",
    });
    assert.deepEqual(
      {
        title: applyHistoricalTranslation(lesson, "es-Caribbean", value).title,
        summary: applyHistoricalTranslation(lesson, "es-Caribbean", value).summary,
        body: applyHistoricalTranslation(lesson, "es-Caribbean", value).body,
      },
      {
        title: "Titulo en espanol",
        summary: "Resumen en espanol",
        body: "Cuerpo completo en espanol",
      },
    );
  });

  it("uses a regional translation when a base language is requested", () => {
    const value = index();
    addHistoricalTranslation(value, lesson.id, "pt-BR", { body: "Corpo em portugues" });
    assert.equal(resolveHistoricalTranslation(value, lesson.id, "pt")?.body, "Corpo em portugues");
  });

  it("keeps newer fields while older duplicate batches only fill gaps", () => {
    const value = index();
    addHistoricalTranslation(value, lesson.id, "fr-CA", { title: "Titre recent", body: "Corps recent" });
    addHistoricalTranslation(value, lesson.id, "fr-CA", { title: "Titre ancien", summary: "Resume ancien", body: "Corps ancien" });
    assert.deepEqual(resolveHistoricalTranslation(value, lesson.id, "fr-CA"), {
      title: "Titre recent",
      summary: "Resume ancien",
      body: "Corps recent",
    });
  });
});
