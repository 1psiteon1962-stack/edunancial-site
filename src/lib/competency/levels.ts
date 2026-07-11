/**
 * Competency Passport — Progressive Level Definitions
 *
 * Shared across all EDUNANCIAL global regions. Regions may override
 * thresholds via RegionPassportConfig without forking this file.
 */

import { CompetencyLevel } from "./types";

export interface LevelDefinition {
  level: CompetencyLevel;
  minScore: number;
  maxScore: number;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  textColor: string;
  badgeEmoji: string;
}

export const COMPETENCY_LEVELS: LevelDefinition[] = [
  {
    level: "Student",
    minScore: 0,
    maxScore: 39,
    label: "Student",
    description: "Beginning your financial competency journey.",
    color: "text-slate-400",
    bgColor: "bg-slate-700",
    textColor: "text-white",
    badgeEmoji: "📚",
  },
  {
    level: "Foundation",
    minScore: 40,
    maxScore: 54,
    label: "Foundation",
    description: "Building core financial literacy and awareness.",
    color: "text-orange-400",
    bgColor: "bg-orange-700",
    textColor: "text-white",
    badgeEmoji: "🏗️",
  },
  {
    level: "Associate",
    minScore: 55,
    maxScore: 69,
    label: "Associate",
    description: "Applying financial principles to everyday decisions.",
    color: "text-yellow-400",
    bgColor: "bg-yellow-600",
    textColor: "text-slate-950",
    badgeEmoji: "⭐",
  },
  {
    level: "Professional",
    minScore: 70,
    maxScore: 84,
    label: "Professional",
    description: "Demonstrating consistent financial competency.",
    color: "text-blue-400",
    bgColor: "bg-blue-700",
    textColor: "text-white",
    badgeEmoji: "🏆",
  },
  {
    level: "Expert",
    minScore: 85,
    maxScore: 94,
    label: "Expert",
    description: "Advanced mastery across multiple financial domains.",
    color: "text-purple-400",
    bgColor: "bg-purple-700",
    textColor: "text-white",
    badgeEmoji: "💎",
  },
  {
    level: "Master",
    minScore: 95,
    maxScore: 100,
    label: "Master",
    description: "Elite financial competency — a lifelong achievement.",
    color: "text-yellow-300",
    bgColor: "bg-yellow-500",
    textColor: "text-slate-950",
    badgeEmoji: "👑",
  },
];

export function getLevelDefinition(
  score: number
): LevelDefinition {
  for (let i = COMPETENCY_LEVELS.length - 1; i >= 0; i--) {
    if (score >= COMPETENCY_LEVELS[i].minScore) {
      return COMPETENCY_LEVELS[i];
    }
  }
  return COMPETENCY_LEVELS[0];
}

export function getCompetencyLevel(score: number): CompetencyLevel {
  return getLevelDefinition(score).level;
}

export function getNextLevel(
  score: number
): LevelDefinition | null {
  const current = getLevelDefinition(score);
  const idx = COMPETENCY_LEVELS.findIndex(
    (l) => l.level === current.level
  );
  if (idx < COMPETENCY_LEVELS.length - 1) {
    return COMPETENCY_LEVELS[idx + 1];
  }
  return null;
}

export function getPointsToNextLevel(score: number): number {
  const next = getNextLevel(score);
  if (!next) return 0;
  return Math.max(0, next.minScore - score);
}

export function getLevelProgress(score: number): number {
  const current = getLevelDefinition(score);
  const range = current.maxScore - current.minScore + 1;
  const earned = score - current.minScore;
  return Math.round((earned / range) * 100);
}
