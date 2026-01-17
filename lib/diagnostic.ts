// lib/diagnostic.ts
// Proprietary Edunancial Diagnostic Engine
// Internal use only – NOT exposed publicly

export type ThinkingLevel = 1 | 2 | 3 | 4 | 5;

export interface DiagnosticQuestion {
  id: string;
  prompt: string;
  options: {
    label: string;
    weight: number; // weighted scoring
  }[];
}

export interface DiagnosticResult {
  score: number;
  level: ThinkingLevel;
}

/**
 * PROPRIETARY QUESTION SET
 * Do NOT expose raw questions or scoring publicly
 */
export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "cash_flow_vs_income",
    prompt: "Which statement best describes how you think about money?",
    options: [
      { label: "I focus on my paycheck and expenses", weight: 1 },
      { label: "I try to save consistently", weight: 2 },
      { label: "I invest for growth", weight: 3 },
      { label: "I structure assets for cash flow", weight: 4 },
      { label: "I design systems that generate capital", weight: 5 },
    ],
  },
  {
    id: "risk_perception",
    prompt: "How do you view financial risk?",
    options: [
      { label: "Risk should be avoided", weight: 1 },
      { label: "Some risk is unavoidable", weight: 2 },
      { label: "Risk can be managed", weight: 3 },
      { label: "Risk can be engineered", weight: 4 },
      { label: "Risk is priced into strategy", weight: 5 },
    ],
  },
];

/**
 * INTERNAL SCORING LOGIC
 */
export function evaluateDiagnostic(
  answers: Record<string, number>
): DiagnosticResult {
  const score = Object.values(answers).reduce((a, b) => a + b, 0);

  let level: ThinkingLevel = 1;
  if (score >= 8) level = 2;
  if (score >= 12) level = 3;
  if (score >= 16) level = 4;
  if (score >= 20) level = 5;

  return { score, level };
}
