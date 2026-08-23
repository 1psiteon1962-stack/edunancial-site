import { normalizeCompetencyScore } from "./competency";
import { decisionCoverage, type DecisionEvaluation, type LearnerDecision } from "./decision";
import type { AppliedLearningScenario } from "./model";

export interface ScenarioEvaluationInput {
  scenario: AppliedLearningScenario;
  decision: LearnerDecision;
  competencyScores: Record<string, number>;
}

export function evaluateScenarioDecision(input: ScenarioEvaluationInput): DecisionEvaluation {
  const { scenario, decision } = input;
  const coverage = decisionCoverage(scenario, decision);
  const normalizedScores = Object.fromEntries(
    scenario.competencyTags.map((tag) => [tag, normalizeCompetencyScore(input.competencyScores[tag] ?? 0)]),
  );

  const strengths = Object.entries(normalizedScores)
    .filter(([, score]) => score >= 80)
    .map(([tag]) => tag);
  const gaps = Object.entries(normalizedScores)
    .filter(([, score]) => score < 70)
    .map(([tag]) => tag);

  const missingTrackNames = coverage.missing.join(", ");
  const feedback = coverage.missing.length
    ? `Your reasoning did not yet address all financial chess pieces in this scenario. Reconsider: ${missingTrackNames}.`
    : "Your reasoning addressed all expected financial chess pieces for this scenario.";

  return {
    scenarioId: scenario.id,
    competencyScores: normalizedScores,
    strengths,
    gaps,
    feedback,
    remediation: gaps.length
      ? `Review or practice these competencies before advancing: ${gaps.join(", ")}.`
      : undefined,
    nextStep: coverage.missing.length
      ? "Revise the decision after considering the missing tracks."
      : "Continue to the next applied-learning scenario.",
  };
}
