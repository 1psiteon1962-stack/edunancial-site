import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { getPublishedLesson } from "@/lib/curriculum/authoritative-published";
import { invalidateRegistryCache } from "@/lib/curriculum/reader";

const ORIGINAL_FALLBACK_FLAG = process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK;

before(() => {
  process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK = "true";
  invalidateRegistryCache();
});

after(() => {
  if (ORIGINAL_FALLBACK_FLAG === undefined) {
    delete process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK;
  } else {
    process.env.EDUNANCIAL_ENABLE_LEGACY_CURRICULUM_REGISTRY_FALLBACK = ORIGINAL_FALLBACK_FLAG;
  }
  invalidateRegistryCache();
});

async function assertCompleteLocalizedLesson(locale: string, bodyEvidence: RegExp): Promise<void> {
  const english = await getPublishedLesson("RED-L1-001", "en");
  const localized = await getPublishedLesson("RED-L1-001", locale);

  assert.ok(english, "RED-L1-001 canonical English lesson must exist");
  assert.ok(localized, `RED-L1-001 must resolve for ${locale}`);
  assert.ok(localized.title.trim(), `${locale} title must not be empty`);
  assert.ok(localized.summary.trim(), `${locale} summary must not be empty`);
  assert.ok(localized.body.trim(), `${locale} body must not be empty`);
  assert.notEqual(localized.body, english.body, `${locale} must not silently fall back to the English lesson body`);
  assert.match(localized.body, bodyEvidence, `${locale} lesson body must contain locale-specific translated content`);
}

test("RED-L1 German resolves a complete translated body", async () => {
  await assertCompleteLocalizedLesson("de", /Lernziele|Lernziel|Kerninhalt|Immobilien/u);
});

test("RED-L1 Brazilian Portuguese resolves a complete translated body", async () => {
  await assertCompleteLocalizedLesson("pt-BR", /Objetivos de Aprendizagem|Conteúdo Principal|imóveis|imobili/u);
});

test("RED-L1 Portugal Portuguese resolves a complete translated body", async () => {
  await assertCompleteLocalizedLesson("pt-PT", /Objetivos de Aprendizagem|Conteúdo Principal|imóveis|imobili/u);
});
