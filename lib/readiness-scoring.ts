// lib/readiness-scoring.ts

export type ReadinessResult = {
  level: string;
  total: number;
  message: string;
};

export function calculateReadinessScore(
  answers: number[]
): ReadinessResult {
  const total = answers.reduce((sum, v) => sum + v, 0);

  if (total <= 5) {
    return {
      level: "Foundational Stage",
      total,
      message:
        "You are at the beginning stage. Focus on structure, fundamentals, and consistency before scaling."
    };
  }

  if (total <= 10) {
    return {
      level: "Development Stage",
      total,
      message:
        "You have some systems in place, but gaps remain. Strengthen operations and financial discipline."
    };
  }

  if (total <= 15) {
    return {
      level: "Growth-Ready Stage",
      total,
      message:
        "You are positioned for growth. Optimize systems, delegation, and risk controls."
    };
  }

  return {
    level: "Scale & Expansion Stage",
    total,
    message:
      "You are structurally ready to scale. Focus on expansion, capital efficiency, and long-term resilience."
  };
}
