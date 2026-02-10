export type ThinkingLevel =
  | "survival"
  | "consumer"
  | "producer"
  | "owner"
  | "investor";

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  options: string[];   // REQUIRED — DiagnosticForm.tsx maps over this
  weight: number;
}

export interface DiagnosticResult {
  level: ThinkingLevel;
  score: number;
}

/**
 * QUESTIONS USED BY components/DiagnosticForm.tsx
 * MUST include `options`
 */
export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "income_vs_expense",
    prompt: "Do you consistently earn more than you spend?",
    options: [
      "Never",
      "Sometimes",
      "Usually",
      "Always"
    ],
    weight: 10
  },
  {
    id: "emergency_fund",
    prompt: "Do you have at least 3–6 months of expenses saved?",
    options: [
      "No savings",
      "Less than 1 month",
      "1–3 months",
      "3–6+ months"
    ],
    weight: 10
  },
  {
    id: "asset_income",
    prompt: "Do you earn income from assets you own?",
    options: [
      "No",
      "Rarely",
      "Occasionally",
      "Consistently"
    ],
    weight: 20
  },
  {
    id: "business_ownership",
    prompt: "Do you own or control a business entity?",
    options: [
      "No",
      "Planning to",
      "Minor ownership",
      "Majority or full owner"
    ],
    weight: 20
  },
  {
    id: "investing_strategy",
    prompt: "Do you invest with a long-term strategy?",
    options: [
      "No investing",
      "Speculative",
      "Mixed",
      "Disciplined long-term"
    ],
    weight: 20
  },
  {
    id: "capital_allocation",
    prompt: "Do you allocate capital based on risk-adjusted return?",
    options: [
      "Never",
      "Rarely",
      "Often",
      "Always"
    ],
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
 * Matches DiagnosticForm.tsx exactly
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
