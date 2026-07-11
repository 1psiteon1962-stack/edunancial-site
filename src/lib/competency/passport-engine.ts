/**
 * Competency Passport — Main Passport Engine
 *
 * Orchestrates all passport subsystems into a single MemberCompetencyPassport.
 * Designed to be consumed by any EDUNANCIAL global region.
 */

import {
  CompetencyAreaScore,
  MemberCompetencyPassport,
  PassportEntry,
  RegionPassportConfig,
} from "./types";
import {
  getCompetencyLevel,
  getNextLevel,
  getPointsToNextLevel,
} from "./levels";
import {
  evaluateAICoachAccess,
  evaluateCourseUnlocks,
} from "./unlock-rules";
import {
  AchievementInput,
  evaluateAchievements,
} from "./achievements";
import {
  countEarnedCertificates,
  generatePassportCertificates,
} from "./certificate-engine";
import { CompetencyScores } from "@/lib/assessment/scoring";
import { NORTH_AMERICA_CONFIG } from "./region-adapter";

// ─── Input Shape ──────────────────────────────────────────────────────────────

export interface PassportEngineInput {
  memberId: string;
  memberName: string;
  scores: CompetencyScores;
  completedCourses: number;
  totalCourses: number;
  hasLoggedIn: boolean;
  learningStreakDays: number;
  earnedAchievementIds?: string[];
  earnedDates?: Record<string, string>;
  historyEntries?: PassportEntry[];
  config?: RegionPassportConfig;
}

// ─── Area Score Labels ────────────────────────────────────────────────────────

function buildAreaScores(scores: CompetencyScores): CompetencyAreaScore[] {
  const colorFor = (s: number): string => {
    if (s >= 85) return "bg-green-500";
    if (s >= 70) return "bg-blue-500";
    if (s >= 55) return "bg-yellow-400";
    if (s >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  return [
    {
      areaId: "personalFinance",
      label: "Personal Finance",
      score: scores.personalFinance,
      color: colorFor(scores.personalFinance),
    },
    {
      areaId: "investing",
      label: "Investing",
      score: scores.investing,
      color: colorFor(scores.investing),
    },
    {
      areaId: "realEstate",
      label: "Real Estate",
      score: scores.realEstate,
      color: colorFor(scores.realEstate),
    },
    {
      areaId: "business",
      label: "Business",
      score: scores.business,
      color: colorFor(scores.business),
    },
    {
      areaId: "riskManagement",
      label: "Risk Management",
      score: scores.riskManagement,
      color: colorFor(scores.riskManagement),
    },
    {
      areaId: "financialProfile",
      label: "Financial Profile",
      score: scores.financialProfile,
      color: colorFor(scores.financialProfile),
    },
  ];
}

// ─── Main Engine ──────────────────────────────────────────────────────────────

export function buildMemberPassport(
  input: PassportEngineInput
): MemberCompetencyPassport {
  const config = input.config ?? NORTH_AMERICA_CONFIG;
  const { scores, memberId, memberName } = input;

  const currentLevel = getCompetencyLevel(scores.overall);
  const nextLevelDef = getNextLevel(scores.overall);
  const pointsToNextLevel = getPointsToNextLevel(scores.overall);

  const certificates = generatePassportCertificates(
    scores,
    memberId,
    memberName,
    config
  );

  const earnedCertCount = countEarnedCertificates(certificates);

  const achievementInput: AchievementInput = {
    completedCourses: input.completedCourses,
    totalCourses: input.totalCourses,
    certificatesEarned: earnedCertCount,
    overallScore: scores.overall,
    assessmentCompleted: scores.overall > 0,
    hasLoggedIn: input.hasLoggedIn,
    learningStreakDays: input.learningStreakDays,
    earnedAchievementIds: input.earnedAchievementIds,
    earnedDates: input.earnedDates,
  };

  const achievements = evaluateAchievements(
    achievementInput,
    config.additionalAchievements
  );

  const aiCoachAccess = evaluateAICoachAccess(scores.overall, config);

  const courseUnlocks = evaluateCourseUnlocks(scores.overall, config);

  const completionPercentage =
    input.totalCourses > 0
      ? Math.round((input.completedCourses / input.totalCourses) * 100)
      : 0;

  return {
    memberId,
    memberName,
    region: config.regionId,
    overallScore: scores.overall,
    currentLevel,
    nextLevel: nextLevelDef?.level ?? null,
    pointsToNextLevel,
    areaScores: buildAreaScores(scores),
    certificates,
    achievements,
    history: input.historyEntries ?? [],
    aiCoachAccess,
    courseUnlocks,
    completedCourses: input.completedCourses,
    totalCourses: input.totalCourses,
    completionPercentage,
  };
}
