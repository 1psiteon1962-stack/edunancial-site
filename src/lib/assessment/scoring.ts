export type CompetencyArea =
  | "personalFinance"
  | "investing"
  | "realEstate"
  | "business"
  | "riskManagement"
  | "financialProfile";

export interface AssessmentAnswer {
  area: CompetencyArea;
  questionId: string;
  answer: "A" | "B" | "C" | "D";
}

export interface CompetencyScores {
  overall: number;

  personalFinance: number;
  investing: number;
  realEstate: number;
  business: number;
  riskManagement: number;
  financialProfile: number;
}

const answerPoints = {
  A: 100,
  B: 75,
  C: 50,
  D: 25,
} as const;

function average(values: number[]): number {
  if (values.length === 0) return 0;

  return Math.round(
    values.reduce((sum, value) => sum + value, 0) /
      values.length
  );
}

export function calculateCompetencyScores(
  answers: AssessmentAnswer[]
): CompetencyScores {

  const buckets: Record<CompetencyArea, number[]> = {
    personalFinance: [],
    investing: [],
    realEstate: [],
    business: [],
    riskManagement: [],
    financialProfile: [],
  };

  answers.forEach((answer) => {
    buckets[answer.area].push(
      answerPoints[answer.answer]
    );
  });

  const personalFinance = average(
    buckets.personalFinance
  );

  const investing = average(
    buckets.investing
  );

  const realEstate = average(
    buckets.realEstate
  );

  const business = average(
    buckets.business
  );

  const riskManagement = average(
    buckets.riskManagement
  );

  const financialProfile = average(
    buckets.financialProfile
  );

  const overall = average([
    personalFinance,
    investing,
    realEstate,
    business,
    riskManagement,
    financialProfile,
  ]);

  return {
    overall,
    personalFinance,
    investing,
    realEstate,
    business,
    riskManagement,
    financialProfile,
  };
}

export function competencyLevel(
  score: number
): string {

  if (score >= 95) return "Master";
  if (score >= 85) return "Advanced";
  if (score >= 70) return "Proficient";
  if (score >= 55) return "Developing";
  if (score >= 40) return "Foundational";

  return "Beginning";
}

export function competencyColor(
  score: number
): string {

  if (score >= 85) return "green";
  if (score >= 70) return "blue";
  if (score >= 55) return "yellow";
  if (score >= 40) return "orange";

  return "red";
}

export function strongestCompetency(
  scores: CompetencyScores
): CompetencyArea {

  const values: [CompetencyArea, number][] = [
    ["personalFinance", scores.personalFinance],
    ["investing", scores.investing],
    ["realEstate", scores.realEstate],
    ["business", scores.business],
    ["riskManagement", scores.riskManagement],
    ["financialProfile", scores.financialProfile],
  ];

  values.sort((a, b) => b[1] - a[1]);

  return values[0][0];
}

export function weakestCompetency(
  scores: CompetencyScores
): CompetencyArea {

  const values: [CompetencyArea, number][] = [
    ["personalFinance", scores.personalFinance],
    ["investing", scores.investing],
    ["realEstate", scores.realEstate],
    ["business", scores.business],
    ["riskManagement", scores.riskManagement],
    ["financialProfile", scores.financialProfile],
  ];

  values.sort((a, b) => a[1] - b[1]);

  return values[0][0];
}
