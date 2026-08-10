import assert from "node:assert/strict";
import test from "node:test";

import {
  canRecordLessonProgressForTier,
  normalizeMembershipToAccessTier,
} from "./access";

test("normalizeMembershipToAccessTier follows app membership model", () => {
  assert.equal(normalizeMembershipToAccessTier("free"), "free");
  assert.equal(normalizeMembershipToAccessTier("basic"), "basic");
  assert.equal(normalizeMembershipToAccessTier("premium"), "pro");
  assert.equal(normalizeMembershipToAccessTier("enterprise"), "gold");
  assert.equal(normalizeMembershipToAccessTier("beta"), "basic");
  assert.equal(normalizeMembershipToAccessTier("free", true), "admin");
});

test("canRecordLessonProgressForTier reuses curriculum access rules", () => {
  assert.equal(canRecordLessonProgressForTier({ level: 1, lessonNumber: 3, membershipTier: "free" }), true);
  assert.equal(canRecordLessonProgressForTier({ level: 1, lessonNumber: 4, membershipTier: "free" }), false);
  assert.equal(canRecordLessonProgressForTier({ level: 3, lessonNumber: 1, membershipTier: "basic" }), false);
  assert.equal(canRecordLessonProgressForTier({ level: 3, lessonNumber: 1, membershipTier: "premium" }), true);
  assert.equal(canRecordLessonProgressForTier({ level: 5, lessonNumber: 1, membershipTier: "enterprise" }), true);
});
