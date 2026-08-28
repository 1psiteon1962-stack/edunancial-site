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

test("getTrack returns restored WHITE Level 1 and empty BLUE levels before BLUE recovery", () => {
  const white = getTrack("WHITE");
  assert.ok(white, "WHITE track should exist");
  assert.equal(white?.levels.length, 5);
  assert.equal(white?.levels.find((level) => level.level === 1)?.lessonCount, 50);
  assert.ok(white?.levels.filter((level) => level.level !== 1).every((level) => level.lessonCount === 0));

  const blue = getTrack("BLUE");
  assert.ok(blue, "BLUE track should exist");
  assert.equal(blue?.levels.length, 5);
  assert.ok(blue?.levels.every((level) => level.lessonCount === 0), "BLUE levels should have zero lessons before recovery");
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
