import { getNeonSql } from "@/lib/db/neon";

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

function requireSql() {
  const sql = getNeonSql();
  if (!sql) throw new Error("Applied-learning persistence is not configured.");
  return sql;
}

export async function upsertAppliedLearningDecision(input: {
  id: string; userId: string; lessonId?: string; track: AppliedLearningTrack;
  level: AppliedLearningLevel; submittedAt: string; decision: LearnerDecision;
}): Promise<AppliedLearningDecisionRow> {
  const sql=requireSql();
  const rows=await sql`
    insert into user_applied_learning_decisions
      (id,user_id,scenario_id,lesson_id,track_code,level_code,rationale,selected_choice_id,
       requested_information,assumptions,risks_identified,tracks_considered,submitted_at)
    values
      (${input.id},${input.userId},${input.decision.scenarioId},${input.lessonId ?? null},${input.track},
       ${input.level},${input.decision.rationale},${input.decision.selectedChoiceId ?? null},
       ${JSON.stringify(input.decision.requestedInformation ?? [])}::jsonb,
       ${JSON.stringify(input.decision.assumptions ?? [])}::jsonb,
       ${JSON.stringify(input.decision.risksIdentified ?? [])}::jsonb,
       ${JSON.stringify(input.decision.tracksConsidered ?? [input.track])}::jsonb,${input.submittedAt})
    on conflict (id) do update set
      scenario_id=excluded.scenario_id,lesson_id=excluded.lesson_id,track_code=excluded.track_code,
      level_code=excluded.level_code,rationale=excluded.rationale,selected_choice_id=excluded.selected_choice_id,
      requested_information=excluded.requested_information,assumptions=excluded.assumptions,
      risks_identified=excluded.risks_identified,tracks_considered=excluded.tracks_considered,
      submitted_at=excluded.submitted_at
    returning *
  `;
  if(!rows[0]) throw new Error("Failed to persist applied-learning decision.");
  return rows[0] as AppliedLearningDecisionRow;
}

export async function listAppliedLearningDecisions(userId:string):Promise<AppliedLearningDecisionRow[]> {
  const sql=requireSql();
  return await sql`select * from user_applied_learning_decisions where user_id=${userId} order by submitted_at desc` as AppliedLearningDecisionRow[];
}

export async function upsertCompetencyEvidence(evidence:CompetencyEvidence):Promise<CompetencyEvidenceRow> {
  const sql=requireSql();
  const rows=await sql`
    insert into user_competency_evidence
      (id,user_id,lesson_id,scenario_id,track_code,level_code,stage,competency_tag,evidence_type,score,demonstrated_at)
    values
      (${evidence.id},${evidence.userId},${evidence.lessonId ?? null},${evidence.scenarioId ?? null},
       ${evidence.track},${evidence.level},${evidence.stage},${evidence.competencyTag},${evidence.evidenceType},
       ${evidence.score},${evidence.demonstratedAt})
    on conflict (id) do update set
      lesson_id=excluded.lesson_id,scenario_id=excluded.scenario_id,track_code=excluded.track_code,
      level_code=excluded.level_code,stage=excluded.stage,competency_tag=excluded.competency_tag,
      evidence_type=excluded.evidence_type,score=excluded.score,demonstrated_at=excluded.demonstrated_at
    returning *
  `;
  if(!rows[0]) throw new Error("Failed to persist competency evidence.");
  return rows[0] as CompetencyEvidenceRow;
}

export async function listCompetencyEvidence(userId:string):Promise<CompetencyEvidenceRow[]> {
  const sql=requireSql();
  return await sql`select * from user_competency_evidence where user_id=${userId} order by demonstrated_at desc` as CompetencyEvidenceRow[];
}
