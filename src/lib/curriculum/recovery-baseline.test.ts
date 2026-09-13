import assert from "node:assert/strict";
import { test } from "node:test";

import { getPublishedTrack } from "@/lib/curriculum/authoritative-published";

const TRACKS = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"] as const;
const RECOVERED_LEVEL_2 = ["RED", "WHITE", "PURPLE"] as const;

/**
 * Recovery non-regression gate.
 *
 * Do not lower these expectations to make a build pass. The production site
 * already exposes this curriculum, so future recovery/upload work must add to
 * this baseline rather than replace it.
 */
test("all eight tracks retain the complete Level 1 baseline", async () => {
  const previous = process.env.NODE_ENV;
  (process.env as Record<string, string | undefined>).NODE_ENV = "production";
  try {
    for (const code of TRACKS) {
      const track = await getPublishedTrack(code, "en-US");
      const level = track?.levels.find((entry) => entry.level === 1);
      assert.equal(level?.lessonCount, 50, `${code} Level 1 must retain all 50 lessons`);
      assert.equal(level?.lessons[0]?.id, `${code}-L1-001`);
      assert.equal(level?.lessons[49]?.id, `${code}-L1-050`);
    }
  } finally {
    (process.env as Record<string, string | undefined>).NODE_ENV = previous;
  }
});

test("verified recovered Level 2 bundles retain all 50 lessons", async () => {
  for (const code of RECOVERED_LEVEL_2) {
    const track = await getPublishedTrack(code, "en-US");
    const level = track?.levels.find((entry) => entry.level === 2);
    assert.equal(level?.lessonCount, 50, `${code} Level 2 must retain all 50 recovered lessons`);
    assert.equal(level?.lessons[0]?.id, `${code}-L2-001`);
    assert.equal(level?.lessons[49]?.id, `${code}-L2-050`);
  }
});

test("all eight committed Level 3 sets remain discoverable", async () => {
  for (const code of TRACKS) {
    const track = await getPublishedTrack(code, "en-US");
    const level = track?.levels.find((entry) => entry.level === 3);
    assert.equal(level?.lessonCount, 50, `${code} Level 3 must retain all 50 committed lessons`);
    assert.equal(level?.lessons[0]?.id, `${code}-L3-001`);
    assert.equal(level?.lessons[49]?.id, `${code}-L3-050`);
  }
});

test("curriculum resolution remains locale-driven rather than language-hardwired", async () => {
  const english = await getPublishedTrack("RED", "en-US");
  const spanish = await getPublishedTrack("RED", "es-ES");
  const frenchCanada = await getPublishedTrack("RED", "fr-CA");
  assert.ok(english && spanish && frenchCanada);
  assert.equal(spanish.code, english.code);
  assert.equal(frenchCanada.code, english.code);
  assert.equal(spanish.levels.find((entry) => entry.level === 1)?.lessonCount, 50);
  assert.equal(frenchCanada.levels.find((entry) => entry.level === 1)?.lessonCount, 50);
});
