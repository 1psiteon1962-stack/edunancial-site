import type {
  AppliedLearningLevel,
  AppliedLearningStage,
  AppliedLearningTrack,
} from "./model";

export type CompetencyEvidenceType =
  | "lesson-completion"
  | "scenario-decision"
  | "quiz"
  | "ai-coach"
  | "reflection";

export interface CompetencyEvidence {
  id: string;
  userId: string;
  lessonId?: string;
  scenarioId?: string;
  track: AppliedLearningTrack;
  level: AppliedLearningLevel;
  stage: AppliedLearningStage;
  competencyTag: string;
  evidenceType: CompetencyEvidenceType;
  score: number;
  demonstratedAt: string;
}

export interface CompetencySummary {
  competencyTag: string;
  tracks: AppliedLearningTrack[];
  highestLevelDemonstrated: AppliedLearningLevel;
  evidenceCount: number;
  averageScore: number;
}

export function normalizeCompetencyScore(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function summarizeCompetencyEvidence(
  evidence: CompetencyEvidence[],
): CompetencySummary[] {
  const grouped = new Map<string, CompetencyEvidence[]>();

  for (const item of evidence) {
    const bucket = grouped.get(item.competencyTag) ?? [];
    bucket.push(item);
    grouped.set(item.competencyTag, bucket);
  }

  return [...grouped.entries()].map(([competencyTag, items]) => {
    const tracks = [...new Set(items.map((item) => item.track))];
    const averageScore = Math.round(
      items.reduce((sum, item) => sum + normalizeCompetencyScore(item.score), 0) /
        items.length,
    );

    return {
      competencyTag,
      tracks,
      highestLevelDemonstrated: Math.max(
        ...items.map((item) => item.level),
      ) as AppliedLearningLevel,
      evidenceCount: items.length,
      averageScore,
    };
  });
}
