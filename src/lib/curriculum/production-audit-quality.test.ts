import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { assessContentQuality, THIN_LESSON_MAX_CHARS } from "@/lib/curriculum/content-quality";

const real = (n: number) => `Lesson ${n}: ${"unique instructional content about topic ".repeat(10)}${"x".repeat(n * 37)} ${"y".repeat(THIN_LESSON_MAX_CHARS)}`;

describe("production audit content quality (report-only)", () => {
  test("one shared body with only IDs/numbers changed is TEMPLATE", () => {
    const bodies = Array.from({ length: 50 }, (_, i) => `BLACK-L2-${String(i + 1).padStart(3, "0")}: Competência de liderança ${i + 1} — aplicação prática. Esta lição desenvolve competências.`);
    const q = assessContentQuality(bodies);
    assert.equal(q.verdict, "TEMPLATE");
    assert.equal(q.distinctBodies, 1);
    assert.equal(q.servedLessons, 50);
  });

  test("distinct but short bodies are THIN", () => {
    const bodies = Array.from({ length: 50 }, (_, i) => `Distinct short lesson about subject ${"abcdefghij"[i % 10]}${"klmnopqrst"[Math.floor(i / 10)]} only.`);
    assert.equal(assessContentQuality(bodies).verdict, "THIN");
  });

  test("distinct full-length lessons are OK", () => {
    const bodies = Array.from({ length: 50 }, (_, i) => real(i));
    const q = assessContentQuality(bodies);
    assert.equal(q.verdict, "OK");
    assert.ok(q.medianBodyChars >= THIN_LESSON_MAX_CHARS);
  });

  test("no served lessons is NONE", () => {
    assert.equal(assessContentQuality([]).verdict, "NONE");
  });
});
