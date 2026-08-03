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
  assert.equal(courses.white.lessons.length, 0);
  assert.equal(courses.blue.lessons.length, 0);
});

test("getCoursePrimaryHref falls back to the track page when lessons are not published yet", () => {
  assert.match(getCoursePrimaryHref(courses.red), /^\/courses\/red\/lessons\/RED-L1-/);
  assert.equal(getCoursePrimaryHref(courses.white), "/courses/white");
  assert.equal(getCoursePrimaryHref(courses.blue), "/courses/blue");
});
