export type ThinkingLevel =
  | "survival"
  | "consumer"
  | "producer"
  | "owner"
  | "investor";

export interface DiagnosticOption {
  label: string;
  value: string;
  weight: number;
}

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  options: DiagnosticOption[];
}

export interface DiagnosticResult {
  level: ThinkingLevel;
  score: number;
}

/**
 * QUESTIONS USED BY components/DiagnosticForm.tsx
 * options MUST be objects with label + weight
 */
export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "income_vs_expense",
    prompt: "Do you consistently earn more than you spend?",
    options: [
      { label: "Never", value: "never", weight: 0 },
      { label: "Sometimes", value: "sometimes", weight: 5 },
      { label: "Usually", value: "usually", weight: 10 },
      { label: "Always", value: "always", weight: 15 }
    ]
  },
  {
    id: "emergency_fund",
    prompt: "Do you have at least 3–6 months of expenses saved?",
    options: [
      { label: "No savings", value: "none", weight: 0 },
      { label: "Less than 1 month", value: "low", weight: 5 },
      { label: "1–3 months", value: "medium", weight: 10 },
      { label: "3–6+ months", value: "high", weight: 15 }
    ]
  },
  {
    id: "asset_income",
    prompt: "Do you earn income from assets you own?",
    options: [
      { label: "No", value: "no", weight: 0 },
      { label: "Rarely", value: "rare", weight: 10 },
      { label: "Occasionally", value: "sometimes", weight: 20 },
      { label: "Consistently", value: "always", weight: 30 }
    ]
  },
  {
    id: "business_ownership",
    prompt: "Do you own or control a business entity?",
    options: [
      { label: "No", value: "none", weight: 0 },
      { label: "Planning to", value: "planning", weight: 10 },
      { label: "Minor ownership", value: "minor", weight: 20 },
      { label: "Majority or full owner", value: "major", weight: 30 }
    ]
  },
  {
    id: "investing_strategy",
    prompt: "Do you invest with a long-term strategy?",
    options: [
      { label: "No investing", value: "none", weight: 0 },
      { label: "Speculative", value: "speculative", weight: 10 },
      { label: "Mixed", value: "mixed", weight: 20 },
      { label: "Disciplined long-term", value: "disciplined", weight: 30 }
    ]
  }
];

const LEVEL_THRESHOLDS: { minScore: number; level: ThinkingLevel }[] = [
  { minScore: 0, level: "survival" },
  { minScore: 25, level: "consumer" },
  { minScore: 50, level: "producer" },
  { minScore: 80, level: "owner" },
  { minScore: 120, level: "investor" }
];

/**
 * ACCEPTS Record<string, number>
 * EXACTLY what DiagnosticForm.tsx sends
 */
export function evaluateDiagnostic(
  answers: Record<string, number>
): DiagnosticResult {
  const score = Object.values(answers).reduce(
    (sum, value) => sum + value,
    0
  );

  const level =
    [...LEVEL_THRESHOLDS]
      .reverse()
      .find(t => score >= t.minScore)?.level ?? "survival";

  return { level, score };
}
