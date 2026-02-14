export type ReadinessResult = {
  level: string;
  message: string;
  total: number;
};

export function calculateReadinessScore(scores: number[]): ReadinessResult {
  const total = scores.reduce((sum, n) => sum + n, 0);

  if (total <= 2) {
    return {
      level: "Foundational",
      message:
        "You are at the beginning stage. Focus on structure, discipline, and repeatable systems before scaling.",
      total,
    };
  }

  if (total <= 4) {
    return {
      level: "Developing",
      message:
        "You have some structure in place, but gaps remain. Strengthen financial controls and operational consistency.",
      total,
    };
  }

  return {
    level: "Scale-Ready",
    message:
      "You demonstrate strong structural readiness. Your next risks are execution and governance at scale.",
    total,
  };
}
