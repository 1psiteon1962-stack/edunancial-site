import type { AppliedLearningScenario, AppliedLearningTrack } from "./model";

export interface LearnerDecision {
  scenarioId: string;
  selectedChoiceId?: string;
  rationale: string;
  requestedInformation?: string[];
  assumptions?: string[];
  risksIdentified?: string[];
  tracksConsidered?: AppliedLearningTrack[];
}

export interface DecisionEvaluation {
  scenarioId: string;
  competencyScores: Record<string, number>;
  strengths: string[];
  gaps: string[];
  feedback: string;
  consequence?: string;
  remediation?: string;
  nextStep?: string;
}

export function decisionCoverage(
  scenario: AppliedLearningScenario,
  decision: LearnerDecision,
): { expected: AppliedLearningTrack[]; considered: AppliedLearningTrack[]; missing: AppliedLearningTrack[] } {
  const expected = [...new Set([scenario.primaryTrack, ...scenario.supportingTracks])];
  const considered = [...new Set(decision.tracksConsidered ?? [scenario.primaryTrack])];
  const missing = expected.filter((track) => !considered.includes(track));

  return { expected, considered, missing };
}

export function isDecisionReadyForEvaluation(decision: LearnerDecision): boolean {
  return decision.rationale.trim().length >= 20;
}
