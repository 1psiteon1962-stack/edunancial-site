export type ThinkingLevel =
  | "survival"
  | "consumer"
  | "producer"
  | "owner"
  | "investor";

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  weight: number;
}

export interface DiagnosticResult {
  level: ThinkingLevel;
  score: number;
}

/**
 * QUESTIONS USED BY components/DiagnosticForm.tsx
 */
export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "income_vs_expense",
    prompt: "Do you consistently earn more than you spend?",
    weight: 10
  },
  {
    id: "emergency_fund",
    prompt: "Do you have at least 3–6 months of expenses saved?",
    weight: 10
  },
  {
    id: "asset_income",
    prompt: "Do you earn income from assets you own?",
    weight: 20
  },
  {
    id: "business_ownership",
    prompt: "Do you own or control a business entity?",
    weight: 20
  },
  {
    id: "investing_strategy",
    prompt: "Do you invest with a long-term strategy rather than speculation?",
    weight: 20
  },
  {
    id: "capital_allocation",
    prompt: "Do you allocate capital based on risk-adjusted return?",
    weight: 20
  }
];

const LEVEL_THRESHOLDS: { minScore: number; level: ThinkingLevel }[] = [
  { minScore: 0, level: "survival" },
  { minScore: 20, level: "consumer" },
  { minScore: 40, level: "producer" },
  { minScore: 60, level: "owner" },
  { minScore: 80, level: "investor" }
];

/**
 * ACCEPTS Record<string, number>
 * (matches DiagnosticForm.tsx exactly)
 */
export function evaluateDiagnostic(
  answers: Record<string, number>
): DiagnosticResult {
  const score = Object.values(answers).reduce(
    (sum, value) => sum + value,
    0
  );

  const matched =
    [...LEVEL_THRESHOLDS]
      .reverse()
      .find(t => score >= t.minScore)?.level ?? "survival";

  return {
    level: matched,
    score
  };
}
