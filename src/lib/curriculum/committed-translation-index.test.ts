import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  bundledTranslationLookupForTests,
  getCommittedLessonTranslation,
  resetCommittedTranslationIndexForTests,
  setCurriculumRuntimeContentForTests,
} from "@/lib/curriculum/committed-translation-fallback";

/**
 * Q1 regression gate: the per-lesson translation index is a pure speed-up.
 * For every lesson and locale it must select exactly the record the original
 * full manifest scan selected, so no learner ever receives different text.
 */

function md(title: string, body: string) {
  return `---\ntitle: ${title}\nsummary: ${title} summary\n---\n# ${title}\n\n${body}\n`;
}
const ITALIAN = "Questa lezione spiega come gli attivi sono importanti quando si impara a gestire il denaro.";

const FIXTURE = [
  { path: "content/courses/red/level-1/fr_CA/RED_L1_001.md", content: md("Underscore winner", "Corps en français.") },
  { path: "content/curriculum/RED/L1/RED-L1-001.fr-CA.md", content: md("Later duplicate", "Corps en français, doublon.") },
  { path: "content/curriculum/RED/L1/XRED-L1-002.fr-CA.md", content: md("Substring match", "Corps pour la leçon deux.") },
  { path: "content/curriculum/RED/L11/RED-L11-001.fr-CA.md", content: md("Decoy level eleven", "Ne doit pas correspondre à L1.") },
  { path: "content/courses/red/level-1/fr/red-l1-003-and-red-l1-004.md", content: md("Two ids one file", "Contenu partagé.") },
  { path: "content/curriculum/BLUE/L2/BLUE-L2-010.es.md", content: md("Lección azul", "Contenido en español.") },
  { path: "content/curriculum/WHITE/L1/WHITE-L1-007.it.md", content: md("Titolo", "English body that must be rejected for Italian.") },
  { path: "content/courses/white/level-1/it/white-l1-007-it.md", content: md("Titolo italiano", ITALIAN) },
  { path: "content/courses/odd/notes-fr-CA-guide.md", content: md("No lesson token", "Sans identifiant.") },
];

const IDS = ["RED-L1-001", "RED-L1-002", "RED-L1-003", "RED-L1-004", "RED-L1-005", "RED-L11-001", "BLUE-L2-010", "WHITE-L1-007", "notes-fr", "ODD"];
const LOCALES = ["fr-CA", "fr", "fr-FR", "es", "es-ES", "es-Caribbean", "it", "de", "pt-BR", "en-US"];

test("indexed bundled lookup selects exactly what the original full scan selected (fixture)", () => {
  setCurriculumRuntimeContentForTests(FIXTURE);
  try {
    for (const id of IDS) for (const locale of LOCALES) {
      assert.deepEqual(
        bundledTranslationLookupForTests(id, locale, "indexed"),
        bundledTranslationLookupForTests(id, locale, "full-scan"),
        `${id} ${locale}`,
      );
    }
    assert.equal(bundledTranslationLookupForTests("RED-L1-001", "fr-CA")?.title, "Underscore winner", "manifest order must still decide the winner");
    assert.equal(bundledTranslationLookupForTests("RED-L1-002", "fr-CA")?.title, "Substring match");
    assert.equal(bundledTranslationLookupForTests("RED-L1-004", "fr")?.title, "Two ids one file");
    assert.equal(bundledTranslationLookupForTests("RED-L11-001", "fr-CA")?.title, "Decoy level eleven");
    assert.equal(bundledTranslationLookupForTests("WHITE-L1-007", "it")?.title, "Titolo italiano", "quality gate still rejects the English-bodied candidate");
  } finally {
    resetCommittedTranslationIndexForTests();
  }
});

test("committed lookup memo returns the identical result on repeat calls", () => {
  setCurriculumRuntimeContentForTests(FIXTURE);
  try {
    const first = getCommittedLessonTranslation("RED-L1-001", "fr-CA");
    const second = getCommittedLessonTranslation("red-l1-001", "fr-CA");
    assert.ok(first);
    assert.equal(second, first);
    assert.equal(getCommittedLessonTranslation("RED-L1-999", "fr-CA"), undefined);
    assert.equal(getCommittedLessonTranslation("RED-L1-999", "fr-CA"), undefined, "a cached miss stays a miss");
  } finally {
    resetCommittedTranslationIndexForTests();
  }
});

test("indexed lookup equals full scan across the real committed manifest when present", (t) => {
  const manifestPath = join(process.cwd(), "content", "generated", "curriculum-runtime-manifest.json");
  if (!existsSync(manifestPath)) { t.skip("runtime manifest not generated in this environment"); return; }
  resetCommittedTranslationIndexForTests();
  const records = JSON.parse(readFileSync(manifestPath, "utf8")) as { path: string }[];
  const ids = [...new Set(records.flatMap((record) => record.path.toUpperCase().replaceAll("_", "-").match(/[A-Z]+-L\d+-\d{3}/gu) ?? []))].sort();
  assert.ok(ids.length > 0);
  let compared = 0;
  for (const locale of ["fr-CA", "es-Caribbean", "it"]) {
    for (const id of ids) {
      assert.deepEqual(bundledTranslationLookupForTests(id, locale, "indexed"), bundledTranslationLookupForTests(id, locale, "full-scan"), `${id} ${locale}`);
      compared += 1;
    }
  }
  assert.ok(compared >= ids.length * 3);
  resetCommittedTranslationIndexForTests();
});
