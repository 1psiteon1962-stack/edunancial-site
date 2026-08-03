import assert from "node:assert/strict";
import test from "node:test";

import {
  courseList,
  courses,
  getCoursePrimaryHref,
} from "./production-catalog";

test("production course catalog always includes the three active curriculum tracks", () => {
  assert.deepEqual(
    courseList.map((course) => course.id),
    ["red", "white", "blue"],
  );
  assert.ok(courses.red.lessons.length > 0, "RED should include published lessons from the registry");
  assert.ok(courses.white.lessons.length > 0, "WHITE should include published lessons from the registry");
  assert.ok(courses.blue.lessons.length > 0, "BLUE should include published lessons from the registry");
});

test("getCoursePrimaryHref links to the first lesson when lessons are published", () => {
  assert.match(getCoursePrimaryHref(courses.red), /^\/courses\/red\/lessons\/RED-L1-/);
  assert.match(getCoursePrimaryHref(courses.white), /^\/courses\/white\/lessons\/WHITE-L1-/);
  assert.match(getCoursePrimaryHref(courses.blue), /^\/courses\/blue\/lessons\/BLUE-L1-/);
});

test("getCoursePrimaryHref falls back to the track page when a course has no lessons", () => {
  const emptyCourse = { id: "test", lessons: [] };
  assert.equal(getCoursePrimaryHref(emptyCourse), "/courses/test");
});
