export type ThinkingLevel =
  | "survival"
  | "consumer"
  | "producer"
  | "owner"
  | "investor";

export interface DiagnosticAnswer {
  questionId: string;
  value: number;
}

export interface DiagnosticResult {
  level: ThinkingLevel;
  score: number;
}

const LEVEL_THRESHOLDS: { minScore: number; level: ThinkingLevel }[] = [
  { minScore: 0, level: "survival" },
  { minScore: 20, level: "consumer" },
  { minScore: 40, level: "producer" },
  { minScore: 60, level: "owner" },
  { minScore: 80, level: "investor" }
];

export function evaluateDiagnostic(
  answers: DiagnosticAnswer[]
): DiagnosticResult {
  const score = answers.reduce((sum, a) => sum + a.value, 0);

  const matched =
    [...LEVEL_THRESHOLDS]
      .reverse()
      .find(t => score >= t.minScore)?.level ?? "survival";

  return {
    level: matched,
    score
  };
}
