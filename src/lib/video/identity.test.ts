import assert from "node:assert/strict";
import test from "node:test";
import { makeVideoLessonId, normalizeVideoLocale, parseVideoLessonId } from "./identity";

test("video lesson identity is universal across tracks and L1-L5", () => {
  assert.equal(makeVideoLessonId("red", 3, 17), "RED-L3-017");
  assert.equal(makeVideoLessonId("BLACK", 5, 50), "BLACK-L5-050");
  assert.deepEqual(parseVideoLessonId("gold-l2-004"), { track: "GOLD", level: 2, lessonNumber: 4 });
});

test("video locale uses the shared Edunancial language catalog", () => {
  assert.equal(normalizeVideoLocale("ht"), "ht");
  assert.equal(normalizeVideoLocale("es-419"), "es-419");
  assert.equal(normalizeVideoLocale("de-DE"), "de");
  assert.equal(normalizeVideoLocale("it-IT"), "it");
});
