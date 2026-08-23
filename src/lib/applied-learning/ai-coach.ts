import type { AppliedLearningLevel, AppliedLearningScenario } from "./model";
import type { LearnerDecision } from "./decision";

const COACH_MODE_BY_LEVEL: Record<AppliedLearningLevel, string> = {
  1: "Explain clearly and verify basic understanding.",
  2: "Coach application. Ask the learner to use the concept in the scenario before supplying an answer.",
  3: "Use Socratic questioning. Challenge assumptions, comparisons, risks, and opportunity costs.",
  4: "Require a multi-step strategy. Introduce tradeoffs and ask how the strategy changes when conditions change.",
  5: "Act as an executive decision coach. Withhold easy conclusions, expose incomplete information, introduce realistic shocks, and require a defensible integrated decision.",
};

export function appliedLearningCoachInstruction(level: AppliedLearningLevel): string {
  return COACH_MODE_BY_LEVEL[level];
}

export function buildScenarioCoachContext(
  scenario: AppliedLearningScenario,
  decision?: LearnerDecision,
): string {
  const tracks = [scenario.primaryTrack, ...scenario.supportingTracks].join(", ");
  const competencies = scenario.competencyTags.join(", ");

  return [
    `Applied-learning level: ${scenario.level}.`,
    COACH_MODE_BY_LEVEL[scenario.level],
    `Scenario: ${scenario.title}.`,
    `Financial chess pieces in play: ${tracks}.`,
    `Competencies being exercised: ${competencies}.`,
    scenario.missingInformation?.length
      ? `The scenario intentionally may omit information. Do not invent it; help the learner identify what additional information is needed.`
      : "Do not invent missing financial facts.",
    decision?.rationale
      ? `Learner rationale: ${decision.rationale}`
      : "The learner has not yet supplied a rationale; ask for one before giving a final judgment.",
    "Do not treat debt as inherently good or bad. Evaluate cost, cash flow, terms, collateral, guarantees, risk, return, liquidity, and opportunity cost.",
    "Do not substitute for individualized legal, tax, investment, or other regulated professional advice.",
  ].join("\n");
}
