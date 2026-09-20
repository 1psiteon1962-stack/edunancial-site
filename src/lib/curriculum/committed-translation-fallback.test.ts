import assert from "node:assert/strict";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { getCommittedLessonTranslation } from "@/lib/curriculum/committed-translation-fallback";

const TEST_ROOT = join(process.cwd(), "content", "curriculum", "TEST", "L1");
const BAD_PATH = join(TEST_ROOT, "TEST-L1-999.es-ES.md");
const GOOD_PATH = join(TEST_ROOT, "TEST-L1-999.es.md");

test("committed translation lookup survives one unreadable candidate and continues to fallback", () => {
  rmSync(join(process.cwd(), "content", "curriculum", "TEST"), { recursive: true, force: true });
  mkdirSync(TEST_ROOT, { recursive: true });

  try {
    // The exact es-ES candidate exists but is a directory, so readFileSync throws EISDIR.
    mkdirSync(BAD_PATH, { recursive: true });
    writeFileSync(
      GOOD_PATH,
      "---\ntitle: Lección de prueba\nsummary: Resumen de prueba\n---\n# TEST-L1-999: Lección de prueba\n\nContenido válido.\n",
      "utf8",
    );

    const translation = getCommittedLessonTranslation("TEST-L1-999", "es-ES");
    assert.ok(translation, "resolver should continue after the unreadable exact-locale candidate");
    assert.equal(translation.title, "Lección de prueba");
    assert.match(translation.body ?? "", /Contenido válido/u);
  } finally {
    rmSync(join(process.cwd(), "content", "curriculum", "TEST"), { recursive: true, force: true });
  }
});

test("unsupported committed lesson lookup degrades to undefined instead of throwing", () => {
  assert.doesNotThrow(() => getCommittedLessonTranslation("NOT-A-LESSON", "es-Caribbean"));
  assert.equal(getCommittedLessonTranslation("NOT-A-LESSON", "es-Caribbean"), undefined);
});


test("legacy localized markdown without front matter derives a summary from body prose", () => {
  const root = join(process.cwd(), "content", "courses", "white", "level-1", "it");
  const path = join(root, "white-l1-it-complete-white-l1-999-it.md");
  mkdirSync(root, { recursive: true });

  try {
    writeFileSync(
      path,
      "# WHITE-L1-999: Lezione di prova\n\n## Obiettivi di Apprendimento\n1. Capire il concetto.\n\n## Contenuto Principale\nQuesta è una spiegazione completa in italiano pensata per verificare che una lezione legacy senza front matter possa comunque produrre un riepilogo utile e una traduzione completa per il runtime.\n\n## Punti Chiave\n- Punto uno.\n",
      "utf8",
    );

    const translation = getCommittedLessonTranslation("WHITE-L1-999", "it");
    assert.ok(translation);
    assert.match(translation.summary ?? "", /Questa è una spiegazione completa in italiano/u);
  } finally {
    rmSync(path, { force: true });
  }
});


test("direct lookup resolves a complete WHITE Italian legacy lesson", () => {
  const translation = getCommittedLessonTranslation("WHITE-L1-001", "it");
  assert.ok(translation, "WHITE-L1-001 Italian legacy translation should resolve directly");
  assert.match(translation.title ?? "", /Cosa Sono gli Attivi di Carta/u);
  assert.match(translation.body ?? "", /Gli attivi di carta sono strumenti finanziari/u);
});
