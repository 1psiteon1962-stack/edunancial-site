export function calculateReadinessScore(scores: number[]) {
  const total = scores.reduce((a, b) => a + b, 0);

  if (total <= 4) {
    return {
      level: "Pause",
      message:
        "Your foundation needs strengthening before advancing to financial tools or capital exposure."
    };
  }

  if (total <= 8) {
    return {
      level: "Prepare",
      message:
        "You show potential, but further financial literacy and structure will improve outcomes."
    };
  }

  if (total <= 11) {
    return {
      level: "Proceed Carefully",
      message:
        "You demonstrate readiness, with room to improve structure and risk awareness."
    };
  }

  return {
    level: "Ready",
    message:
      "You demonstrate strong financial readiness and discipline to advance responsibly."
  };
}
