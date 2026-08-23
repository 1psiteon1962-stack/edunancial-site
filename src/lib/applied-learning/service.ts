import { normalizeCompetencyScore, type CompetencyEvidence } from "./competency";
import { isDecisionReadyForEvaluation, type DecisionEvaluation, type LearnerDecision } from "./decision";
import { appliedLearningStage, shouldUseAppliedLearningExtension, type AppliedLearningScenario } from "./model";
import {
  listCompetencyEvidence,
  upsertAppliedLearningDecision,
  upsertCompetencyEvidence,
} from "./repository";

export async function recordAdvancedScenarioResult(input: {
  id: string;
  userId: string;
  lessonId?: string;
  scenario: AppliedLearningScenario;
  decision: LearnerDecision;
  evaluation: DecisionEvaluation;
  submittedAt?: string;
}): Promise<void> {
  if (!shouldUseAppliedLearningExtension(input.scenario.level)) {
    throw new Error("Applied-learning persistence is reserved for Levels 2-5.");
  }
  if (!isDecisionReadyForEvaluation(input.decision)) {
    throw new Error("Learner rationale is not ready for evaluation.");
  }

  const demonstratedAt = input.submittedAt ?? new Date().toISOString();

  await upsertAppliedLearningDecision({
    id: input.id,
    userId: input.userId,
    lessonId: input.lessonId,
    track: input.scenario.primaryTrack,
    level: input.scenario.level,
    submittedAt: demonstratedAt,
    decision: input.decision,
  });

  for (const competencyTag of input.scenario.competencyTags) {
    const score = normalizeCompetencyScore(input.evaluation.competencyScores[competencyTag] ?? 0);
    const evidence: CompetencyEvidence = {
      id: `${input.id}:${competencyTag}`,
      userId: input.userId,
      lessonId: input.lessonId,
      scenarioId: input.scenario.id,
      track: input.scenario.primaryTrack,
      level: input.scenario.level,
      stage: appliedLearningStage(input.scenario.level),
      competencyTag,
      evidenceType: "scenario-decision",
      score,
      demonstratedAt,
    };
    await upsertCompetencyEvidence(evidence);
  }
}

export async function getAdvancedCompetencyEvidence(userId: string): Promise<CompetencyEvidence[]> {
  const rows = await listCompetencyEvidence(userId);
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    lessonId: row.lesson_id ?? undefined,
    scenarioId: row.scenario_id ?? undefined,
    track: row.track_code,
    level: row.level_code,
    stage: row.stage,
    competencyTag: row.competency_tag,
    evidenceType: row.evidence_type,
    score: row.score,
    demonstratedAt: row.demonstrated_at,
  }));
}
