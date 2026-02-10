export interface ReadinessResult {
  score: number;
  level: "foundational" | "developing" | "scalable" | "investment-ready";
}

export function calculateReadinessScore(
  answers: number[]
): ReadinessResult {
  const score = answers.reduce((sum, value) => sum + value, 0);

  if (score < 20) {
    return { score, level: "foundational" };
  }

  if (score < 40) {
    return { score, level: "developing" };
  }

  if (score < 60) {
    return { score, level: "scalable" };
  }

  return { score, level: "investment-ready" };
}
