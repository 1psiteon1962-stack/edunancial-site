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
