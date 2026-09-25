export type CoachIntent = "explain" | "example" | "quiz" | "learning-path" | "general";

export function classifyCoachIntent(message: string): CoachIntent {
  const text = message.toLowerCase();
  if (/\b(quiz|test me|question me|practice question)\b/.test(text)) return "quiz";
  if (/\b(example|scenario|case study|show me how)\b/.test(text)) return "example";
  if (/\b(path|what should i learn|where should i start|learning plan|study plan)\b/.test(text)) return "learning-path";
  if (/\b(explain|what does|what is|simpler|understand|mean)\b/.test(text)) return "explain";
  return "general";
}

export function buildIntentInstruction(intent: CoachIntent): string {
  if (intent === "quiz") return "Give one curriculum-grounded practice question. Do not reveal the answer until the learner attempts it.";
  if (intent === "example") return "Give a practical fictional example tied to the active lesson; clearly label assumptions.";
  if (intent === "learning-path") return "Recommend curriculum areas to study, not financial actions or products.";
  if (intent === "explain") return "Explain the active concept clearly at the learner's current competency depth.";
  return "Keep the answer educational, curriculum-grounded, and decision-neutral.";
}
