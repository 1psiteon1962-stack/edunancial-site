import assert from "node:assert/strict";
import test from "node:test";

import {
  getCanonicalCourseHref,
  getCanonicalCourseRoute,
  getCanonicalLessonHref,
  getCanonicalLessonRoute,
} from "./routes";

test("maps production and legacy course routes to canonical curriculum paths", () => {
  assert.deepEqual(getCanonicalCourseRoute("red"), {
    track: "red",
    level: null,
    href: "/curriculum/red",
  });
  assert.deepEqual(getCanonicalCourseRoute("red-level-1"), {
    track: "red",
    level: 1,
    href: "/curriculum/red/l1",
  });
  assert.equal(getCanonicalCourseHref("red-real-estate"), "/curriculum/red");
  assert.equal(getCanonicalCourseHref("white-paper-assets"), "/curriculum/white");
  assert.equal(getCanonicalCourseHref("blue-business"), "/curriculum/blue");
});

test("maps canonical and legacy lesson routes to curriculum lesson pages", () => {
  assert.deepEqual(getCanonicalLessonRoute("red", "RED-L1-001"), {
    track: "red",
    level: 1,
    lessonId: "red-l1-001",
    href: "/curriculum/red/l1/red-l1-001",
  });
  assert.deepEqual(getCanonicalLessonRoute("red-level-1", "red-101"), {
    track: "red",
    level: 1,
    lessonId: "red-l1-001",
    href: "/curriculum/red/l1/red-l1-001",
  });
  assert.equal(
    getCanonicalLessonHref("red-level-1", "red-110"),
    "/curriculum/red/l1/red-l1-010",
  );
});
