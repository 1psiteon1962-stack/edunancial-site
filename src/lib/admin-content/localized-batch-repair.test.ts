import assert from "node:assert/strict";
import { describe, test } from "node:test";

import type { ExtractedFile } from "@/lib/admin-content/types";
import { extractLocalizedLessonTranslation, resolveLocalizedFileLocale } from "@/lib/admin-content/localized-batch-repair";

function lessonFile(overrides: Partial<ExtractedFile> = {}): ExtractedFile {
  const body = `---\ntitle: Liderança vs. Gestão: Duas Habilidades Diferentes\nsummary: Explica por que liderança e gestão resolvem problemas diferentes.\n---\n# Liderança vs. Gestão: Duas Habilidades Diferentes\n\n## Objetivos de aprendizagem\n\nConteúdo completo em português.`;
  return {
    id: "file-1", batchId: "batch-1", uploadId: "upload-1",
    originalFilename: "BLACK-L1-001.md", normalizedFilename: "black-l1-001.md",
    archivePath: "BLACK-L1-001.md", sourceArchiveFilename: "BLACK_L1_pt-BR_50_CURRICULUM_COMPLETO.zip",
    extension: ".md", mimeType: "text/markdown", sizeBytes: body.length, checksum: "checksum",
    processingStatus: "classified", reviewStatus: "approved", conflictStatus: "none", duplicateStatus: "new",
    previewText: body, rawText: body, encodedContent: Buffer.from(body).toString("base64"),
    classification: { category: "lessons", subcategory: "level-1", language: "en-US", academyLevel: "level-1", destination: "content/courses/black/level-1/en-US/black-l1-001.md", confidence: 1, reasons: [], pillar: "black" },
    metadata: { language: "en-US", region: null, title: "", description: "", source: "upload", intendedDestination: "content/courses/black/level-1/en-US/black-l1-001.md", contentType: "lessons", pillar: "black", academyLevel: "level-1", publicationStatus: "approved", version: "1.0", checksum: "checksum", uploadBatchId: "batch-1" },
    warnings: [], error: null, approvedAt: new Date().toISOString(), rejectedAt: null, updatedAt: new Date().toISOString(), ...overrides,
  };
}

describe("localized batch publication", () => {
  test("inherits pt-BR from the containing ZIP when lesson filenames have no locale", () => {
    const file = lessonFile();
    assert.equal(resolveLocalizedFileLocale(file), "pt-BR");
    const translation = extractLocalizedLessonTranslation(file);
    assert.ok(translation);
    assert.equal(translation.locale, "pt-BR");
    assert.equal(translation.lessonId, "BLACK-L1-001");
    assert.equal(translation.title, "Liderança vs. Gestão: Duas Habilidades Diferentes");
    assert.match(translation.body, /Conteúdo completo em português/u);
    assert.doesNotMatch(translation.body, /^---/u);
  });

  test("recovers locale from the parent upload when legacy extracted-file metadata says en-US", () => {
    const file = lessonFile({ sourceArchiveFilename: null });
    assert.equal(resolveLocalizedFileLocale(file), "en-US");
    assert.equal(extractLocalizedLessonTranslation(file), null);
    const parentZip = "GOLD_L1_es-Caribbean_50_CURRICULUM_COMPLETO.zip";
    assert.equal(resolveLocalizedFileLocale(file, parentZip), "es-Caribbean");
    const translation = extractLocalizedLessonTranslation(file, parentZip);
    assert.ok(translation);
    assert.equal(translation.locale, "es-Caribbean");
  });

  test("publishes regional English such as en-GB as localized content", () => {
    const file = lessonFile({ sourceArchiveFilename: "BLACK_L1_en-GB_50_CURRICULUM_COMPLETE.zip" });
    assert.equal(resolveLocalizedFileLocale(file), "en-GB");
    assert.ok(extractLocalizedLessonTranslation(file));
  });

  test("does not turn canonical en-US packages into translations", () => {
    const file = lessonFile({ sourceArchiveFilename: "BLACK_L1_en-US_50_CURRICULUM_COMPLETE.zip" });
    assert.equal(resolveLocalizedFileLocale(file), "en-US");
    assert.equal(extractLocalizedLessonTranslation(file), null);
  });

  test("supports the production locale families used by curriculum ZIPs", () => {
    const cases: Array<[string, string]> = [
      ["BLACK_L1_fr-CA_50_CURRICULUM_COMPLET.zip", "fr-CA"], ["BLACK_L1_fr-FR_50_CURRICULUM_COMPLET.zip", "fr-FR"],
      ["BLACK_L1_es-ES_50_CURRICULO_COMPLETO.zip", "es-ES"], ["BLACK-L1-es-Caribbean-COMPLETE.zip", "es-Caribbean"],
      ["BLACK_L1_pt-PT_50_CURRICULO_COMPLETO.zip", "pt-PT"], ["BLACK_L1_de-DE_50_CURRICULUM_VOLLSTAENDIG.zip", "de"],
      ["BLACK_L1_nl-NL_50_CURRICULUM_VOLLEDIG.zip", "nl"], ["BLACK_L1_it-IT_50_CURRICULUM_COMPLETO.zip", "it"],
    ];
    for (const [archive, expected] of cases) assert.equal(resolveLocalizedFileLocale(lessonFile({ sourceArchiveFilename: archive })), expected, archive);
  });
});
