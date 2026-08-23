import type { CompetencySummary } from "./competency";
import type { AppliedLearningLevel } from "./model";

export interface ProgressionDecision {
  ready: boolean;
  targetLevel: AppliedLearningLevel;
  reasons: string[];
}

const REQUIRED_AVERAGE_BY_LEVEL: Record<AppliedLearningLevel, number> = {
  1: 0,
  2: 70,
  3: 72,
  4: 75,
  5: 80,
};

export function evaluateLevelReadiness(
  targetLevel: AppliedLearningLevel,
  competencies: CompetencySummary[],
): ProgressionDecision {
  if (targetLevel === 1) return { ready: true, targetLevel, reasons: [] };

  const threshold = REQUIRED_AVERAGE_BY_LEVEL[targetLevel];
  const relevant = competencies.filter((item) => item.highestLevelDemonstrated >= targetLevel - 1);
  const reasons: string[] = [];

  if (!relevant.length) {
    reasons.push("No competency evidence from the preceding level has been demonstrated yet.");
  }

  for (const competency of relevant) {
    if (competency.averageScore < threshold) {
      reasons.push(`${competency.competencyTag} is ${competency.averageScore}%; target is ${threshold}%.`);
    }
  }

  return { ready: relevant.length > 0 && reasons.length === 0, targetLevel, reasons };
}
