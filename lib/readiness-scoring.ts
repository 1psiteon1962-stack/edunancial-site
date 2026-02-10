export type ReadinessResult = {
  level: string;
  message: string;
};

export function calculateReadinessScore(scores: number[]): ReadinessResult {
  const total = scores.reduce((a, b) => a + b, 0);

  if (total <= 2) {
    return {
      level: "Pause",
      message:
        "Your foundation needs significant strengthening before moving forward."
    };
  }

  if (total <= 5) {
    return {
      level: "Prepare",
      message:
        "You show potential, but additional structure and discipline are required."
    };
  }

  if (total <= 7) {
    return {
      level: "Proceed Carefully",
      message:
        "You demonstrate readiness, but should address remaining gaps carefully."
    };
  }

  return {
    level: "Ready",
    message:
      "You demonstrate strong readiness and are positioned to proceed confidently."
  };
}
