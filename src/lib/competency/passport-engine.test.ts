/**
 * Tests for the Member Competency Passport engine.
 * Tests pure-logic modules that need no path-alias resolution.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { getLevelDefinition, getCompetencyLevel, getNextLevel, getPointsToNextLevel, getLevelProgress } from "./levels.js";
import { evaluateAchievements } from "./achievements.js";
import { evaluateAICoachAccess, evaluateCourseUnlocks } from "./unlock-rules.js";

// ─── levels.ts ────────────────────────────────────────────────────────────────

test("getCompetencyLevel: score 0 → Student", () => {
  assert.equal(getCompetencyLevel(0), "Student");
});

test("getCompetencyLevel: score 39 → Student", () => {
  assert.equal(getCompetencyLevel(39), "Student");
});

test("getCompetencyLevel: score 40 → Foundation", () => {
  assert.equal(getCompetencyLevel(40), "Foundation");
});

test("getCompetencyLevel: score 55 → Associate", () => {
  assert.equal(getCompetencyLevel(55), "Associate");
});

test("getCompetencyLevel: score 70 → Professional", () => {
  assert.equal(getCompetencyLevel(70), "Professional");
});

test("getCompetencyLevel: score 85 → Expert", () => {
  assert.equal(getCompetencyLevel(85), "Expert");
});

test("getCompetencyLevel: score 95 → Master", () => {
  assert.equal(getCompetencyLevel(95), "Master");
});

test("getCompetencyLevel: score 100 → Master", () => {
  assert.equal(getCompetencyLevel(100), "Master");
});

test("getNextLevel: Student → Foundation", () => {
  const next = getNextLevel(20);
  assert.ok(next);
  assert.equal(next.level, "Foundation");
});

test("getNextLevel: Master returns null (no higher level)", () => {
  const next = getNextLevel(98);
  assert.equal(next, null);
});

test("getPointsToNextLevel: 72 → 13 points to Expert (85)", () => {
  assert.equal(getPointsToNextLevel(72), 13);
});

test("getPointsToNextLevel: Master returns 0", () => {
  assert.equal(getPointsToNextLevel(97), 0);
});

test("getLevelProgress: midpoint of Foundation", () => {
  const progress = getLevelProgress(47);
  assert.ok(progress > 0 && progress < 100);
});

test("getLevelDefinition: returns correct bgColor for Student", () => {
  const def = getLevelDefinition(20);
  assert.ok(def.bgColor.includes("slate"));
});

// ─── achievements.ts ──────────────────────────────────────────────────────────

test("evaluateAchievements: first-login earned when hasLoggedIn=true", () => {
  const result = evaluateAchievements({
    completedCourses: 0,
    totalCourses: 10,
    certificatesEarned: 0,
    overallScore: 0,
    assessmentCompleted: false,
    hasLoggedIn: true,
    learningStreakDays: 0,
  });
  const loginAchievement = result.find((a) => a.id === "first-login");
  assert.ok(loginAchievement);
  assert.equal(loginAchievement.earned, true);
});

test("evaluateAchievements: level-professional earned at score 70", () => {
  const result = evaluateAchievements({
    completedCourses: 5,
    totalCourses: 10,
    certificatesEarned: 1,
    overallScore: 72,
    assessmentCompleted: true,
    hasLoggedIn: true,
    learningStreakDays: 0,
  });
  const lvl = result.find((a) => a.id === "level-professional");
  assert.ok(lvl);
  assert.equal(lvl.earned, true);
});

test("evaluateAchievements: level-expert NOT earned at score 72", () => {
  const result = evaluateAchievements({
    completedCourses: 5,
    totalCourses: 10,
    certificatesEarned: 0,
    overallScore: 72,
    assessmentCompleted: true,
    hasLoggedIn: true,
    learningStreakDays: 0,
  });
  const expert = result.find((a) => a.id === "level-expert");
  assert.ok(expert);
  assert.equal(expert.earned, false);
});

test("evaluateAchievements: streak-7 earned when streak >= 7", () => {
  const result = evaluateAchievements({
    completedCourses: 0,
    totalCourses: 10,
    certificatesEarned: 0,
    overallScore: 0,
    assessmentCompleted: false,
    hasLoggedIn: true,
    learningStreakDays: 8,
  });
  const streak = result.find((a) => a.id === "streak-7");
  assert.ok(streak);
  assert.equal(streak.earned, true);
});

// ─── unlock-rules.ts ──────────────────────────────────────────────────────────

test("evaluateAICoachAccess: unlocked at score 40", () => {
  const access = evaluateAICoachAccess(40);
  assert.equal(access.unlocked, true);
  assert.equal(access.pointsNeeded, 0);
});

test("evaluateAICoachAccess: locked at score 39", () => {
  const access = evaluateAICoachAccess(39);
  assert.equal(access.unlocked, false);
  assert.equal(access.pointsNeeded, 1);
});

test("evaluateAICoachAccess: custom threshold respected", () => {
  const access = evaluateAICoachAccess(60, {
    aiCoachUnlockScore: 70,
    aiCoachRequiredLevel: "Professional",
  });
  assert.equal(access.unlocked, false);
  assert.equal(access.pointsNeeded, 10);
});

test("evaluateCourseUnlocks: beginner courses unlocked at score 0", () => {
  const unlocks = evaluateCourseUnlocks(0);
  const beginner = unlocks.find((c) => c.courseId === "personal-finance-101");
  assert.ok(beginner);
  assert.equal(beginner.unlocked, true);
});

test("evaluateCourseUnlocks: advanced course locked at score 0", () => {
  const unlocks = evaluateCourseUnlocks(0);
  const advanced = unlocks.find((c) => c.courseId === "advanced-investing");
  assert.ok(advanced);
  assert.equal(advanced.unlocked, false);
});

test("evaluateCourseUnlocks: advanced-investing unlocked at score 70", () => {
  const unlocks = evaluateCourseUnlocks(70);
  const advanced = unlocks.find((c) => c.courseId === "advanced-investing");
  assert.ok(advanced);
  assert.equal(advanced.unlocked, true);
});

test("evaluateCourseUnlocks: region override respected", () => {
  const unlocks = evaluateCourseUnlocks(60, {
    courseUnlockOverrides: { "advanced-investing": 55 },
  });
  const advanced = unlocks.find((c) => c.courseId === "advanced-investing");
  assert.ok(advanced);
  assert.equal(advanced.unlocked, true);
});
