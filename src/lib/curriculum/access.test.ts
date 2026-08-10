import assert from "node:assert/strict";
import test from "node:test";

import {
  canAccessCurriculumLesson,
  getRequiredCurriculumTier,
  isPublicCurriculumLesson,
  normalizeToCurriculumTier,
  hasCurriculumMembership,
} from "./access";

// ---------------------------------------------------------------------------
// normalizeToCurriculumTier
// ---------------------------------------------------------------------------

test("normalizeToCurriculumTier: free and undefined map to free", () => {
  assert.equal(normalizeToCurriculumTier("free"), "free");
  assert.equal(normalizeToCurriculumTier(undefined), "free");
  assert.equal(normalizeToCurriculumTier(null), "free");
  assert.equal(normalizeToCurriculumTier(""), "free");
});

test("normalizeToCurriculumTier: basic maps to basic", () => {
  assert.equal(normalizeToCurriculumTier("basic"), "basic");
});

test("normalizeToCurriculumTier: beta maps to basic", () => {
  assert.equal(normalizeToCurriculumTier("beta"), "basic");
});

test("normalizeToCurriculumTier: premium maps to pro", () => {
  assert.equal(normalizeToCurriculumTier("premium"), "pro");
});

test("normalizeToCurriculumTier: enterprise maps to gold", () => {
  assert.equal(normalizeToCurriculumTier("enterprise"), "gold");
});

// ---------------------------------------------------------------------------
// getRequiredCurriculumTier
// ---------------------------------------------------------------------------

test("getRequiredCurriculumTier: L1 lessons 001–003 are free", () => {
  assert.equal(getRequiredCurriculumTier(1, 1), "free");
  assert.equal(getRequiredCurriculumTier(1, 2), "free");
  assert.equal(getRequiredCurriculumTier(1, 3), "free");
});

test("getRequiredCurriculumTier: L1 lesson 004 requires basic", () => {
  assert.equal(getRequiredCurriculumTier(1, 4), "basic");
});

test("getRequiredCurriculumTier: L1 lesson 050 requires basic", () => {
  assert.equal(getRequiredCurriculumTier(1, 50), "basic");
});

test("getRequiredCurriculumTier: all L2 lessons require basic", () => {
  for (const num of [1, 10, 25, 50]) {
    assert.equal(getRequiredCurriculumTier(2, num), "basic");
  }
});

test("getRequiredCurriculumTier: all L3 lessons require pro", () => {
  for (const num of [1, 10, 50]) {
    assert.equal(getRequiredCurriculumTier(3, num), "pro");
  }
});

test("getRequiredCurriculumTier: all L4 lessons require pro", () => {
  for (const num of [1, 10, 50]) {
    assert.equal(getRequiredCurriculumTier(4, num), "pro");
  }
});

test("getRequiredCurriculumTier: all L5 lessons require gold", () => {
  for (const num of [1, 10, 50]) {
    assert.equal(getRequiredCurriculumTier(5, num), "gold");
  }
});

// ---------------------------------------------------------------------------
// isPublicCurriculumLesson
// ---------------------------------------------------------------------------

test("isPublicCurriculumLesson: L1 001–003 are public", () => {
  assert.equal(isPublicCurriculumLesson(1, 1), true);
  assert.equal(isPublicCurriculumLesson(1, 2), true);
  assert.equal(isPublicCurriculumLesson(1, 3), true);
});

test("isPublicCurriculumLesson: L1 004 is not public", () => {
  assert.equal(isPublicCurriculumLesson(1, 4), false);
});

test("isPublicCurriculumLesson: L2 and above are not public", () => {
  assert.equal(isPublicCurriculumLesson(2, 1), false);
  assert.equal(isPublicCurriculumLesson(3, 1), false);
  assert.equal(isPublicCurriculumLesson(5, 1), false);
});

// ---------------------------------------------------------------------------
// hasCurriculumMembership
// ---------------------------------------------------------------------------

test("hasCurriculumMembership: free and undefined have no membership", () => {
  assert.equal(hasCurriculumMembership("free"), false);
  assert.equal(hasCurriculumMembership(undefined), false);
  assert.equal(hasCurriculumMembership(null), false);
});

test("hasCurriculumMembership: basic, premium, enterprise, beta all have membership", () => {
  assert.equal(hasCurriculumMembership("basic"), true);
  assert.equal(hasCurriculumMembership("premium"), true);
  assert.equal(hasCurriculumMembership("enterprise"), true);
  assert.equal(hasCurriculumMembership("beta"), true);
});

// ---------------------------------------------------------------------------
// canAccessCurriculumLesson — cumulative access rules
// ---------------------------------------------------------------------------

test("admin can access every lesson regardless of tier", () => {
  for (const [level, num] of [[1, 1], [1, 4], [2, 1], [3, 1], [4, 1], [5, 1]] as const) {
    assert.equal(canAccessCurriculumLesson({ level, lessonNumber: num, isAdmin: true }), true, `L${level}-${num}`);
  }
});

test("free tier can only access L1 001–003", () => {
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 1 }), true);
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 2 }), true);
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 3 }), true);
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 4 }), false);
  assert.equal(canAccessCurriculumLesson({ level: 2, lessonNumber: 1 }), false);
  assert.equal(canAccessCurriculumLesson({ level: 3, lessonNumber: 1 }), false);
  assert.equal(canAccessCurriculumLesson({ level: 5, lessonNumber: 1 }), false);
});

test("basic membership accesses L1 001–003 and L1 004–050 and all L2; locked on L3+", () => {
  // public
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 1, membershipTier: "basic" }), true);
  // basic-gated L1
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 4, membershipTier: "basic" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 50, membershipTier: "basic" }), true);
  // all L2
  assert.equal(canAccessCurriculumLesson({ level: 2, lessonNumber: 1, membershipTier: "basic" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 2, lessonNumber: 30, membershipTier: "basic" }), true);
  // L3+ locked
  assert.equal(canAccessCurriculumLesson({ level: 3, lessonNumber: 1, membershipTier: "basic" }), false);
  assert.equal(canAccessCurriculumLesson({ level: 4, lessonNumber: 1, membershipTier: "basic" }), false);
  assert.equal(canAccessCurriculumLesson({ level: 5, lessonNumber: 1, membershipTier: "basic" }), false);
});

test("beta membership has same access as basic", () => {
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 4, membershipTier: "beta" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 2, lessonNumber: 1, membershipTier: "beta" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 3, lessonNumber: 1, membershipTier: "beta" }), false);
});

test("pro (premium) membership accesses L1–L4 but not L5", () => {
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 1, membershipTier: "premium" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 4, membershipTier: "premium" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 2, lessonNumber: 1, membershipTier: "premium" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 3, lessonNumber: 1, membershipTier: "premium" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 4, lessonNumber: 1, membershipTier: "premium" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 5, lessonNumber: 1, membershipTier: "premium" }), false);
});

test("gold (enterprise) membership accesses all levels", () => {
  for (const level of [1, 2, 3, 4, 5] as const) {
    assert.equal(
      canAccessCurriculumLesson({ level, lessonNumber: 1, membershipTier: "enterprise" }),
      true,
      `L${level}`,
    );
  }
});

test("access is cumulative: gold includes basic and pro content", () => {
  assert.equal(canAccessCurriculumLesson({ level: 1, lessonNumber: 4, membershipTier: "enterprise" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 2, lessonNumber: 25, membershipTier: "enterprise" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 3, lessonNumber: 1, membershipTier: "enterprise" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 4, lessonNumber: 10, membershipTier: "enterprise" }), true);
  assert.equal(canAccessCurriculumLesson({ level: 5, lessonNumber: 1, membershipTier: "enterprise" }), true);
});
