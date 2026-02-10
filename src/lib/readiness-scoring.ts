/**
 * Scoring logic for EduReadiness
 * Import path MUST be "@/lib/readiness-scoring"
 */

export interface ReadinessResult {
  score: number;
  level: "foundational" | "developing" | "scalable" | "investment-ready";
}

/**
 * Expects an array of numeric weights selected by the user.
 * Example input: [10, 20, 30, 20, 10]
 */
export function calculateReadinessScore(
  answers: number[]
): ReadinessResult {
  const score = answers.reduce((sum, value) => sum + value, 0);

  if (score < 40) {
    return {
      score,
      level: "foundational"
    };
  }

  if (score < 80) {
    return {
      score,
      level: "developing"
    };
  }

  if (score < 120) {
    return {
      score,
      level: "scalable"
    };
  }

  return {
    score,
    level: "investment-ready"
  };
}
