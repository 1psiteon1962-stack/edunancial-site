import assert from "node:assert/strict";
import test from "node:test";

import { getPlaceholderLessonMeta, getTrack, listAcademies } from "./reader";

test("listAcademies keeps RED, WHITE, and BLUE active regardless of published lessons", () => {
  const academies = listAcademies();

  assert.deepEqual(
    academies.map((academy) => academy.code),
    ["RED", "WHITE", "BLUE"],
  );
  assert.ok(academies.every((academy) => academy.levels.length === 5));
});

test("getTrack returns summaries for WHITE and BLUE with L1 lessons and empty upper levels", () => {
  for (const code of ["WHITE", "BLUE"] as const) {
    const track = getTrack(code);
    assert.ok(track, `${code} track should exist`);
    assert.equal(track?.levels.length, 5);
    // Level 1 now has published lessons; levels 2-5 remain empty.
    assert.ok((track?.levels[0]?.lessonCount ?? 0) > 0, `${code} L1 should have published lessons`);
    assert.ok(
      track?.levels.slice(1).every((level) => level.lessonCount === 0),
      `${code} levels 2-5 should have zero lessons`,
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
