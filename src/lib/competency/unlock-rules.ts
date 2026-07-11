/**
 * Competency Passport — Unlock Rules
 *
 * Defines which competency score/level is required to access:
 *   • AI Coaching
 *   • Individual courses
 *
 * All thresholds are configurable per-region via RegionPassportConfig.
 */

import { AICoachAccess, CompetencyLevel, CourseUnlock, RegionPassportConfig } from "./types";
import { getCompetencyLevel } from "./levels";

// ─── Default Global Thresholds ────────────────────────────────────────────────

const DEFAULT_AI_COACH_SCORE = 40;
const DEFAULT_AI_COACH_LEVEL: CompetencyLevel = "Foundation";

// ─── Course catalog with per-course unlock requirements ───────────────────────

interface CourseCatalogEntry {
  courseId: string;
  title: string;
  requiredLevel: CompetencyLevel;
  requiredScore: number;
}

export const GLOBAL_COURSE_CATALOG: CourseCatalogEntry[] = [
  {
    courseId: "personal-finance-101",
    title: "Personal Financial Management",
    requiredLevel: "Student",
    requiredScore: 0,
  },
  {
    courseId: "credit-cash-flow",
    title: "Credit & Cash Flow Mastery",
    requiredLevel: "Student",
    requiredScore: 0,
  },
  {
    courseId: "investing-fundamentals",
    title: "Investing Fundamentals",
    requiredLevel: "Foundation",
    requiredScore: 40,
  },
  {
    courseId: "real-estate-foundations",
    title: "Real Estate Foundations",
    requiredLevel: "Foundation",
    requiredScore: 40,
  },
  {
    courseId: "business-fundamentals",
    title: "Business Fundamentals",
    requiredLevel: "Associate",
    requiredScore: 55,
  },
  {
    courseId: "risk-management",
    title: "Risk Management & Asset Protection",
    requiredLevel: "Associate",
    requiredScore: 55,
  },
  {
    courseId: "advanced-investing",
    title: "Advanced Investing Strategies",
    requiredLevel: "Professional",
    requiredScore: 70,
  },
  {
    courseId: "real-estate-advanced",
    title: "Advanced Real Estate",
    requiredLevel: "Professional",
    requiredScore: 70,
  },
  {
    courseId: "executive-leadership",
    title: "Executive Leadership & Strategy",
    requiredLevel: "Expert",
    requiredScore: 85,
  },
  {
    courseId: "global-investing",
    title: "Global Investing",
    requiredLevel: "Expert",
    requiredScore: 85,
  },
  {
    courseId: "financial-mastery",
    title: "Financial Mastery Program",
    requiredLevel: "Master",
    requiredScore: 95,
  },
];

// ─── AI Coach Unlock ──────────────────────────────────────────────────────────

export function evaluateAICoachAccess(
  currentScore: number,
  config?: Pick<RegionPassportConfig, "aiCoachUnlockScore" | "aiCoachRequiredLevel">
): AICoachAccess {
  const requiredScore = config?.aiCoachUnlockScore ?? DEFAULT_AI_COACH_SCORE;
  const requiredLevel = config?.aiCoachRequiredLevel ?? DEFAULT_AI_COACH_LEVEL;
  const currentLevel = getCompetencyLevel(currentScore);
  const unlocked = currentScore >= requiredScore;

  return {
    unlocked,
    requiredLevel,
    requiredScore,
    currentLevel,
    currentScore,
    pointsNeeded: Math.max(0, requiredScore - currentScore),
  };
}

// ─── Course Unlock ────────────────────────────────────────────────────────────

export function evaluateCourseUnlocks(
  currentScore: number,
  config?: Pick<RegionPassportConfig, "courseUnlockOverrides">
): CourseUnlock[] {
  return GLOBAL_COURSE_CATALOG.map((entry) => {
    const effectiveScore =
      config?.courseUnlockOverrides?.[entry.courseId] ??
      entry.requiredScore;

    const unlocked = currentScore >= effectiveScore;

    return {
      courseId: entry.courseId,
      title: entry.title,
      requiredLevel: entry.requiredLevel,
      requiredScore: effectiveScore,
      unlocked,
      reason: unlocked
        ? undefined
        : `Requires ${effectiveScore} competency score (${entry.requiredLevel} level).`,
    };
  });
}

// ─── Convenience ─────────────────────────────────────────────────────────────

export function getUnlockedCourses(
  currentScore: number,
  config?: Pick<RegionPassportConfig, "courseUnlockOverrides">
): CourseUnlock[] {
  return evaluateCourseUnlocks(currentScore, config).filter(
    (c) => c.unlocked
  );
}

export function getLockedCourses(
  currentScore: number,
  config?: Pick<RegionPassportConfig, "courseUnlockOverrides">
): CourseUnlock[] {
  return evaluateCourseUnlocks(currentScore, config).filter(
    (c) => !c.unlocked
  );
}
