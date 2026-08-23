import { supabaseSelect, supabaseUpsert } from "@/lib/supabase/server";

import type {
  AppliedLearningLevel,
  AppliedLearningStage,
  AppliedLearningTrack,
} from "./model";
import type { CompetencyEvidence, CompetencyEvidenceType } from "./competency";
import type { LearnerDecision } from "./decision";

export interface AppliedLearningDecisionRow {
  id: string;
  user_id: string;
  scenario_id: string;
  lesson_id: string | null;
  track_code: AppliedLearningTrack;
  level_code: AppliedLearningLevel;
  rationale: string;
  selected_choice_id: string | null;
  requested_information: string[];
  assumptions: string[];
  risks_identified: string[];
  tracks_considered: AppliedLearningTrack[];
  submitted_at: string;
}

export interface CompetencyEvidenceRow {
  id: string;
  user_id: string;
  lesson_id: string | null;
  scenario_id: string | null;
  track_code: AppliedLearningTrack;
  level_code: AppliedLearningLevel;
  stage: AppliedLearningStage;
  competency_tag: string;
  evidence_type: CompetencyEvidenceType;
  score: number;
  demonstrated_at: string;
}

export async function upsertAppliedLearningDecision(input: {
  id: string;
  userId: string;
  lessonId?: string;
  track: AppliedLearningTrack;
  level: AppliedLearningLevel;
  submittedAt: string;
  decision: LearnerDecision;
}): Promise<AppliedLearningDecisionRow> {
  const rows = await supabaseUpsert<AppliedLearningDecisionRow>(
    "user_applied_learning_decisions",
    {
      id: input.id,
      user_id: input.userId,
      scenario_id: input.decision.scenarioId,
      lesson_id: input.lessonId ?? null,
      track_code: input.track,
      level_code: input.level,
      rationale: input.decision.rationale,
      selected_choice_id: input.decision.selectedChoiceId ?? null,
      requested_information: input.decision.requestedInformation ?? [],
      assumptions: input.decision.assumptions ?? [],
      risks_identified: input.decision.risksIdentified ?? [],
      tracks_considered: input.decision.tracksConsidered ?? [input.track],
      submitted_at: input.submittedAt,
    },
    "id",
  );

  if (!rows[0]) throw new Error("Failed to persist applied-learning decision.");
  return rows[0];
}

export function listAppliedLearningDecisions(userId: string): Promise<AppliedLearningDecisionRow[]> {
  return supabaseSelect<AppliedLearningDecisionRow>("user_applied_learning_decisions", {
    filters: { user_id: userId },
    order: { column: "submitted_at", ascending: false },
  });
}

export async function upsertCompetencyEvidence(
  evidence: CompetencyEvidence,
): Promise<CompetencyEvidenceRow> {
  const rows = await supabaseUpsert<CompetencyEvidenceRow>(
    "user_competency_evidence",
    {
      id: evidence.id,
      user_id: evidence.userId,
      lesson_id: evidence.lessonId ?? null,
      scenario_id: evidence.scenarioId ?? null,
      track_code: evidence.track,
      level_code: evidence.level,
      stage: evidence.stage,
      competency_tag: evidence.competencyTag,
      evidence_type: evidence.evidenceType,
      score: evidence.score,
      demonstrated_at: evidence.demonstratedAt,
    },
    "id",
  );

  if (!rows[0]) throw new Error("Failed to persist competency evidence.");
  return rows[0];
}

export function listCompetencyEvidence(userId: string): Promise<CompetencyEvidenceRow[]> {
  return supabaseSelect<CompetencyEvidenceRow>("user_competency_evidence", {
    filters: { user_id: userId },
    order: { column: "demonstrated_at", ascending: false },
  });
}
