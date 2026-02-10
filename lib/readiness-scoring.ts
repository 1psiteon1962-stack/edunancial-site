export type ReadinessLevel = "Pause" | "Prepare" | "Proceed Carefully" | "Ready";

export type ReadinessResult = {
  level: ReadinessLevel;
  total: number;
  message: string;
};

export function calculateReadinessScore(scores: number[]): ReadinessResult {
  const total = Array.isArray(scores) ? scores.reduce((a, b) => a + b, 0) : 0;

  // With 3 questions scored 0/1/3 each:
  // min 0, max 9
  if (total <= 2) {
    return {
      level: "Pause",
      total,
      message:
        "Your foundation needs strengthening first. Focus on structure, record-keeping, and basic compliance before taking on additional risk."
    };
  }

  if (total <= 5) {
    return {
      level: "Prepare",
      total,
      message:
        "You show potential, but there are gaps to close. Tighten operations, improve documentation, and clean up compliance before scaling."
    };
  }

  if (total <= 7) {
    return {
      level: "Proceed Carefully",
      total,
      message:
        "You demonstrate readiness with a few remaining weak points. Move forward, but use safeguards: written processes, contracts, and tracking."
    };
  }

  return {
    level: "Ready",
    total,
    message:
      "You demonstrate strong readiness. Your fundamentals are solid—continue to document systems and scale with discipline."
  };
}
