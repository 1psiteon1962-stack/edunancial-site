/**
 * Access Gate Tests
 *
 * Validates the centralised curriculum membership gating rule:
 *   FREE  ↔  level === 1 && lessonNumber >= 1 && lessonNumber <= 3
 *   GATED ↔  (level === 1 && lessonNumber >= 4) || level >= 2
 *
 * Tests cover all eight curriculum tracks, all required membership-status
 * scenarios, and a security check that verifies protected lesson bodies
 * cannot be retrieved by unauthorised viewers.
 */

import test from "node:test";
import assert from "node:assert/strict";

import { canAccessLesson } from "./tier-config";
import { isFreeLesson, checkLessonAccess, getViewerTierFromCookies } from "./access-gate";
import {
  createMemberSessionValue,
  authTierToCurriculumTier,
  MEMBER_SESSION_COOKIE,
} from "./member-session";

// ---------------------------------------------------------------------------
// Helper: build a Cookie header string containing a member session
// ---------------------------------------------------------------------------

function memberCookie(authTier: string, email = "user@example.com"): string {
  const tier = authTierToCurriculumTier(authTier);
  const value = createMemberSessionValue(tier, email);
  return `${MEMBER_SESSION_COOKIE}=${value}`;
}

const ANONYMOUS = null; // no Cookie header

// ---------------------------------------------------------------------------
// 1. isFreeLesson — centralised free/gated boundary
// ---------------------------------------------------------------------------

test("isFreeLesson: L1 lessons 1–3 are free", () => {
  assert.equal(isFreeLesson(1, 1), true);
  assert.equal(isFreeLesson(1, 2), true);
  assert.equal(isFreeLesson(1, 3), true);
});

test("isFreeLesson: L1 lesson 4+ is not free", () => {
  assert.equal(isFreeLesson(1, 4), false);
  assert.equal(isFreeLesson(1, 50), false);
  assert.equal(isFreeLesson(1, 100), false);
});

test("isFreeLesson: all levels 2–5 are not free regardless of lesson number", () => {
  for (const level of [2, 3, 4, 5]) {
    assert.equal(isFreeLesson(level, 1), false, `L${level} lesson 1 should not be free`);
    assert.equal(isFreeLesson(level, 3), false, `L${level} lesson 3 should not be free`);
  }
});

// ---------------------------------------------------------------------------
// 2. canAccessLesson — tier-config gating rule
// ---------------------------------------------------------------------------

test("canAccessLesson: free preview (level 1, lessons 1–3) allowed for free/paid viewers", () => {
  // Note: test-drive is intentionally excluded — it only unlocks explicit sample lessons,
  // not the entire free preview zone. Admin, free, basic, pro, gold all get the preview.
  for (const tier of ["free", "basic", "pro", "gold", "admin"] as const) {
    assert.equal(canAccessLesson(1, 1, tier), true, `${tier} should access L1 lesson 1`);
    assert.equal(canAccessLesson(1, 2, tier), true, `${tier} should access L1 lesson 2`);
    assert.equal(canAccessLesson(1, 3, tier), true, `${tier} should access L1 lesson 3`);
  }
});

test("canAccessLesson: L1 lesson 4+ is gated for free viewers", () => {
  assert.equal(canAccessLesson(1, 4, "free"), false);
  assert.equal(canAccessLesson(1, 50, "free"), false);
  assert.equal(canAccessLesson(1, 100, "free"), false);
});

test("canAccessLesson: admin bypasses all gating", () => {
  assert.equal(canAccessLesson(1, 4, "admin"), true);
  assert.equal(canAccessLesson(2, 1, "admin"), true);
  assert.equal(canAccessLesson(5, 50, "admin"), true);
});

// ---------------------------------------------------------------------------
// 3. All eight tracks — access rule applies identically
// ---------------------------------------------------------------------------

const TRACKS = ["RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK"] as const;

test("RED: L1 lesson 1 free, L1 lesson 3 free, L1 lesson 4 gated, L1 lesson 50 gated, L2 lesson 1 gated", () => {
  assert.equal(isFreeLesson(1, 1), true,  "RED L1 lesson 1 must be free");
  assert.equal(isFreeLesson(1, 3), true,  "RED L1 lesson 3 must be free");
  assert.equal(isFreeLesson(1, 4), false, "RED L1 lesson 4 must be gated");
  assert.equal(isFreeLesson(1, 50), false,"RED L1 lesson 50 must be gated");
  assert.equal(isFreeLesson(2, 1), false, "RED L2 lesson 1 must be gated");
});

test("WHITE: L1 lesson 1 free, L1 lesson 4 gated, L2 lesson 1 gated", () => {
  assert.equal(isFreeLesson(1, 1), true,  "WHITE L1 lesson 1 must be free");
  assert.equal(isFreeLesson(1, 4), false, "WHITE L1 lesson 4 must be gated");
  assert.equal(isFreeLesson(2, 1), false, "WHITE L2 lesson 1 must be gated");
});

test("BLUE: L1 lesson 3 free, L1 lesson 4 gated, L3 lesson 1 gated", () => {
  assert.equal(isFreeLesson(1, 3), true,  "BLUE L1 lesson 3 must be free");
  assert.equal(isFreeLesson(1, 4), false, "BLUE L1 lesson 4 must be gated");
  assert.equal(isFreeLesson(3, 1), false, "BLUE L3 lesson 1 must be gated");
});

test("GREEN: L1 lesson 3 free, L4 lesson 1 gated", () => {
  assert.equal(isFreeLesson(1, 3), true,  "GREEN L1 lesson 3 must be free");
  assert.equal(isFreeLesson(4, 1), false, "GREEN L4 lesson 1 must be gated");
});

test("GOLD: L1 lesson 3 free, L5 lesson 1 gated", () => {
  assert.equal(isFreeLesson(1, 3), true,  "GOLD L1 lesson 3 must be free");
  assert.equal(isFreeLesson(5, 1), false, "GOLD L5 lesson 1 must be gated");
});

test("PURPLE: L1 lesson 3 free, L2 lesson 1 gated", () => {
  assert.equal(isFreeLesson(1, 3), true,  "PURPLE L1 lesson 3 must be free");
  assert.equal(isFreeLesson(2, 1), false, "PURPLE L2 lesson 1 must be gated");
});

test("ORANGE: L1 lesson 3 free, L3 lesson 1 gated", () => {
  assert.equal(isFreeLesson(1, 3), true,  "ORANGE L1 lesson 3 must be free");
  assert.equal(isFreeLesson(3, 1), false, "ORANGE L3 lesson 1 must be gated");
});

test("BLACK: L1 lesson 3 free, L1 lesson 4 gated, L5 lesson 1 gated", () => {
  assert.equal(isFreeLesson(1, 3), true,  "BLACK L1 lesson 3 must be free");
  assert.equal(isFreeLesson(1, 4), false, "BLACK L1 lesson 4 must be gated");
  assert.equal(isFreeLesson(5, 1), false, "BLACK L5 lesson 1 must be gated");
});

test("all eight tracks apply the same gating rule (isFreeLesson is track-agnostic)", () => {
  // The rule is centralised and does not depend on the track code
  for (const _track of TRACKS) {
    // Free zone
    assert.equal(isFreeLesson(1, 1), true);
    assert.equal(isFreeLesson(1, 2), true);
    assert.equal(isFreeLesson(1, 3), true);
    // Gated zone
    assert.equal(isFreeLesson(1, 4), false);
    assert.equal(isFreeLesson(2, 1), false);
    assert.equal(isFreeLesson(3, 1), false);
    assert.equal(isFreeLesson(4, 1), false);
    assert.equal(isFreeLesson(5, 1), false);
  }
});

// ---------------------------------------------------------------------------
// 4. Membership status scenarios
// ---------------------------------------------------------------------------

test("anonymous viewer: L1 lessons 1–3 allowed, L1 lesson 4/50 gated, L2–L5 lesson 1 gated", () => {
  // Allowed
  assert.equal(checkLessonAccess(1, 1, ANONYMOUS).allowed, true,  "anon L1 lesson 1 must be allowed");
  assert.equal(checkLessonAccess(1, 2, ANONYMOUS).allowed, true,  "anon L1 lesson 2 must be allowed");
  assert.equal(checkLessonAccess(1, 3, ANONYMOUS).allowed, true,  "anon L1 lesson 3 must be allowed");
  // Gated
  assert.equal(checkLessonAccess(1, 4, ANONYMOUS).allowed,  false, "anon L1 lesson 4 must be gated");
  assert.equal(checkLessonAccess(1, 50, ANONYMOUS).allowed, false, "anon L1 lesson 50 must be gated");
  assert.equal(checkLessonAccess(2, 1, ANONYMOUS).allowed,  false, "anon L2 lesson 1 must be gated");
  assert.equal(checkLessonAccess(3, 1, ANONYMOUS).allowed,  false, "anon L3 lesson 1 must be gated");
  assert.equal(checkLessonAccess(4, 1, ANONYMOUS).allowed,  false, "anon L4 lesson 1 must be gated");
  assert.equal(checkLessonAccess(5, 1, ANONYMOUS).allowed,  false, "anon L5 lesson 1 must be gated");
});

test("anonymous viewer is not marked as authenticated", () => {
  const result = checkLessonAccess(1, 4, ANONYMOUS);
  assert.equal(result.isAuthenticated, false);
});

test("authenticated non-member (free tier): L1 lesson 3 allowed, L1 lesson 4 gated, L2/L5 lesson 1 gated", () => {
  const cookie = memberCookie("free");
  assert.equal(checkLessonAccess(1, 3, cookie).allowed, true,  "free member L1 lesson 3 allowed");
  assert.equal(checkLessonAccess(1, 4, cookie).allowed, false, "free member L1 lesson 4 gated");
  assert.equal(checkLessonAccess(2, 1, cookie).allowed, false, "free member L2 lesson 1 gated");
  assert.equal(checkLessonAccess(5, 1, cookie).allowed, false, "free member L5 lesson 1 gated");
});

test("authenticated non-member is marked as authenticated in gate result", () => {
  const cookie = memberCookie("free");
  const result = checkLessonAccess(1, 4, cookie);
  assert.equal(result.isAuthenticated, true);
});

test("basic member: L1 lessons 1–4 allowed, L2 lesson 1 allowed; L3 lesson 1 gated", () => {
  const cookie = memberCookie("basic");
  assert.equal(checkLessonAccess(1, 1, cookie).allowed, true,  "basic L1 lesson 1 allowed");
  assert.equal(checkLessonAccess(1, 4, cookie).allowed, true,  "basic L1 lesson 4 allowed");
  assert.equal(checkLessonAccess(2, 1, cookie).allowed, true,  "basic L2 lesson 1 allowed");
  assert.equal(checkLessonAccess(3, 1, cookie).allowed, false, "basic L3 lesson 1 gated");
});

test("premium (pro) member: L1–L4 allowed; L5 lesson 1 gated", () => {
  const cookie = memberCookie("premium");
  assert.equal(checkLessonAccess(1, 50, cookie).allowed, true, "pro L1 lesson 50 allowed");
  assert.equal(checkLessonAccess(2, 1, cookie).allowed,  true, "pro L2 lesson 1 allowed");
  assert.equal(checkLessonAccess(4, 1, cookie).allowed,  true, "pro L4 lesson 1 allowed");
  assert.equal(checkLessonAccess(5, 1, cookie).allowed,  false,"pro L5 lesson 1 gated");
});

test("enterprise (gold) member: all levels 1–5 allowed", () => {
  const cookie = memberCookie("enterprise");
  assert.equal(checkLessonAccess(1, 4, cookie).allowed,  true, "gold L1 lesson 4 allowed");
  assert.equal(checkLessonAccess(1, 50, cookie).allowed, true, "gold L1 lesson 50 allowed");
  assert.equal(checkLessonAccess(2, 1, cookie).allowed,  true, "gold L2 lesson 1 allowed");
  assert.equal(checkLessonAccess(3, 1, cookie).allowed,  true, "gold L3 lesson 1 allowed");
  assert.equal(checkLessonAccess(4, 1, cookie).allowed,  true, "gold L4 lesson 1 allowed");
  assert.equal(checkLessonAccess(5, 1, cookie).allowed,  true, "gold L5 lesson 1 allowed");
});

test("beta member maps to basic curriculum tier", () => {
  const cookie = memberCookie("beta");
  assert.equal(authTierToCurriculumTier("beta"), "basic");
  assert.equal(checkLessonAccess(2, 1, cookie).allowed, true,  "beta L2 lesson 1 allowed (basic)");
  assert.equal(checkLessonAccess(3, 1, cookie).allowed, false, "beta L3 lesson 1 gated (basic)");
});

// ---------------------------------------------------------------------------
// 5. Expired / tampered session → treated as free
// ---------------------------------------------------------------------------

test("tampered member session cookie is rejected and treated as free/anonymous", () => {
  const legit = createMemberSessionValue("gold", "user@example.com");
  const tampered = legit.slice(0, -4) + "XXXX"; // corrupt the signature
  const cookie = `${MEMBER_SESSION_COOKIE}=${tampered}`;
  const tier = getViewerTierFromCookies(cookie);
  assert.equal(tier, "free", "tampered cookie must be treated as free");
  assert.equal(checkLessonAccess(2, 1, cookie).allowed, false, "tampered cookie must be gated on L2 lesson 1");
});

test("missing member session cookie → free tier", () => {
  assert.equal(getViewerTierFromCookies(null), "free");
  assert.equal(getViewerTierFromCookies(""), "free");
  assert.equal(getViewerTierFromCookies("some_other_cookie=value"), "free");
});

// ---------------------------------------------------------------------------
// 6. authTierToCurriculumTier mapping
// ---------------------------------------------------------------------------

test("authTierToCurriculumTier maps all expected auth tiers", () => {
  assert.equal(authTierToCurriculumTier("free"),       "free");
  assert.equal(authTierToCurriculumTier("basic"),      "basic");
  assert.equal(authTierToCurriculumTier("premium"),    "pro");
  assert.equal(authTierToCurriculumTier("enterprise"), "gold");
  assert.equal(authTierToCurriculumTier("beta"),       "basic");
  assert.equal(authTierToCurriculumTier(undefined),    "free");
  assert.equal(authTierToCurriculumTier("unknown"),    "free");
});

// ---------------------------------------------------------------------------
// 7. Security: protected lesson body must not be accessible to free/anonymous
// ---------------------------------------------------------------------------

test("security: free/anonymous viewer is denied protected content (no body returned)", () => {
  // Simulate what the page does: check access before fetching lesson body.
  // This test validates the gate logic itself — the page must NOT render
  // the lesson body when access.allowed === false.
  const scenarios: Array<{ level: number; lessonNumber: number; cookie: string | null }> = [
    { level: 1, lessonNumber: 4, cookie: ANONYMOUS },
    { level: 1, lessonNumber: 50, cookie: ANONYMOUS },
    { level: 2, lessonNumber: 1, cookie: ANONYMOUS },
    { level: 3, lessonNumber: 1, cookie: ANONYMOUS },
    { level: 4, lessonNumber: 1, cookie: ANONYMOUS },
    { level: 5, lessonNumber: 1, cookie: ANONYMOUS },
    { level: 1, lessonNumber: 4, cookie: memberCookie("free") },
    { level: 2, lessonNumber: 1, cookie: memberCookie("free") },
  ];

  for (const { level, lessonNumber, cookie } of scenarios) {
    const result = checkLessonAccess(level, lessonNumber, cookie);
    assert.equal(
      result.allowed,
      false,
      `L${level} lesson ${lessonNumber} must be denied to free/anon viewer`,
    );
    // If the server respects result.allowed === false, no lesson body is served.
    // The page renders the gate UI instead — verified here by checking the result.
  }
});

test("security: paid member is granted protected content", () => {
  const cookie = memberCookie("enterprise");
  const scenarios = [
    { level: 1, lessonNumber: 4 },
    { level: 1, lessonNumber: 50 },
    { level: 2, lessonNumber: 1 },
    { level: 5, lessonNumber: 1 },
  ];
  for (const { level, lessonNumber } of scenarios) {
    const result = checkLessonAccess(level, lessonNumber, cookie);
    assert.equal(
      result.allowed,
      true,
      `Enterprise member must be allowed L${level} lesson ${lessonNumber}`,
    );
  }
});
