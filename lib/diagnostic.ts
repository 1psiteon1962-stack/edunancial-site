export type ThinkingLevel =
  | "Survival"
  | "Lifestyle"
  | "Wealth-Building"
  | "Empire Builder"
  | "Capital Architect";

export type DiagnosticOption = {
  label: string;
  value: string;
  weight: number;
};

export type DiagnosticQuestion = {
  id: string;
  prompt: string;
  options: DiagnosticOption[];
};

export const diagnosticQuestions: DiagnosticQuestion[] = [
  {
    id: "systems",
    prompt: "How do you run your work right now?",
    options: [
      { label: "Mostly reactive; I handle fires as they come", value: "reactive", weight: 0 },
      { label: "Some structure; I track tasks but it's inconsistent", value: "some", weight: 1 },
      { label: "Documented systems; repeatable operations", value: "systems", weight: 2 },
      { label: "Teams + governance; KPIs and controls", value: "governance", weight: 3 }
    ]
  },
  {
    id: "risk",
    prompt: "How do you treat risk and compliance?",
    options: [
      { label: "I deal with it when it becomes a problem", value: "late", weight: 0 },
      { label: "I try to follow rules but I'm not fully organized", value: "partial", weight: 1 },
      { label: "I plan risk early with contracts and checklists", value: "early", weight: 2 },
      { label: "Risk is engineered into strategy and structure", value: "engineered", weight: 3 }
    ]
  },
  {
    id: "scale",
    prompt: "What best describes your scaling approach?",
    options: [
      { label: "I need income now; short-term focus", value: "now", weight: 0 },
      { label: "I want stable income; limited scaling", value: "stable", weight: 1 },
      { label: "I build assets and reinvest intentionally", value: "reinvest", weight: 2 },
      { label: "I build platforms, capital stacks, and expansion lanes", value: "platform", weight: 3 }
    ]
  }
];

export function evaluateDiagnostic(answers: Record<string, number>): { level: ThinkingLevel } {
  const total = Object.values(answers || {}).reduce((a, b) => a + b, 0);

  if (total <= 2) return { level: "Survival" };
  if (total <= 4) return { level: "Lifestyle" };
  if (total <= 6) return { level: "Wealth-Building" };
  if (total <= 8) return { level: "Empire Builder" };
  return { level: "Capital Architect" };
}
