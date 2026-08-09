import assert from "node:assert/strict";
import test from "node:test";

import { getPlaceholderLessonMeta, getTrack, listAcademies } from "./reader";

test("listAcademies returns all eight academies with five levels each", () => {
  const academies = listAcademies();

  assert.deepEqual(
    academies.map((academy) => academy.code),
    ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"],
  );
  assert.ok(academies.every((academy) => academy.levels.length === 5));
});

test("getTrack returns summaries for WHITE and BLUE with empty levels when no lessons are published", () => {
  for (const code of ["WHITE", "BLUE"] as const) {
    const track = getTrack(code);
    assert.ok(track, `${code} track should exist`);
    assert.equal(track?.levels.length, 5);
    assert.ok(
      track?.levels.every((level) => level.lessonCount === 0),
      `${code} levels should have zero lessons`,
    );
  }
});

test("getPlaceholderLessonMeta builds a lesson placeholder for active tracks", () => {
  const placeholder = getPlaceholderLessonMeta("WHITE", "WHITE-L1-001", 1);

  assert.ok(placeholder);
  assert.equal(placeholder?.track, "WHITE");
  assert.equal(placeholder?.level, 1);
  assert.equal(placeholder?.lessonNumber, 1);
  assert.match(placeholder?.summary ?? "", /active curriculum track/i);
  assert.equal(getPlaceholderLessonMeta("WHITE", "BLUE-L1-001", 1), null);
  assert.equal(getPlaceholderLessonMeta("WHITE", "WHITE-L2-001", 1), null);
});
