export type LevelDefinition = {
  title: string;
  description: string;
  requiredPlan: "free" | "starter" | "pro" | "growth" | "elite" | "enterprise";
};

export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    title: "Level 1 — Starter",
    description: "Entry-level tools and foundational access.",
    requiredPlan: "starter",
  },
  {
    title: "Level 2 — Growth",
    description: "Intermediate scaling and wealth-building systems.",
    requiredPlan: "growth",
  },
  {
    title: "Level 3 — Pro",
    description: "Advanced execution tools for serious builders.",
    requiredPlan: "pro",
  },
  {
    title: "Level 4 — Elite",
    description: "Founder-grade systems and premium access.",
    requiredPlan: "elite",
  },
  {
    title: "Level 5 — Enterprise",
    description: "Full enterprise-level strategy and private systems.",
    requiredPlan: "enterprise",
  },
];
