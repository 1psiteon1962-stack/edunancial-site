// lib/readiness-scoring.ts

export type ReadinessResult = {
  level: string;
  total: number;
  message: string;
};

export function calculateReadinessScore(scores: number[]): ReadinessResult {
  const total = scores.reduce((a, b) => a + b, 0);

  if (total <= 4) {
    return {
      level: "Pause",
      total,
      message: "Your foundation needs strengthening before proceeding further.",
    };
  }

  if (total <= 8) {
    return {
      level: "Prepare",
      total,
      message: "You show potential, but further preparation is recommended.",
    };
  }

  if (total <= 11) {
    return {
      level: "Proceed Carefully",
      total,
      message: "You demonstrate readiness, with some remaining risk areas.",
    };
  }

  return {
    level: "Ready",
    total,
    message: "You demonstrate strong financial and structural readiness.",
  };
}
