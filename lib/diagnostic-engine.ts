import { DIAGNOSTIC_QUESTIONS } from "./diagnostic-questions";

export function scoreDiagnostic(responses: Record<string, number>) {
  let score = 0;

  for (const q of DIAGNOSTIC_QUESTIONS) {
    const value = responses[q.id] ?? 0;
    score += value * q.weight;
  }

  if (score <= 10) return 1;
  if (score <= 18) return 2;
  if (score <= 26) return 3;
  if (score <= 34) return 4;
  return 5;
}
