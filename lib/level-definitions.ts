export type LevelDefinition = {
  code: string;
  title: string;
  description: string;
};

export const LEVEL_DEFINITIONS: Record<string, LevelDefinition> = {
  "level-1": {
    code: "starter",
    title: "Level 1 — Starter",
    description: "Entry-level tools and financial basics.",
  },
  "level-2": {
    code: "builder",
    title: "Level 2 — Builder",
    description: "Business building and intermediate systems.",
  },
  "level-3": {
    code: "pro",
    title: "Level 3 — Pro",
    description: "Advanced entrepreneur and investor tools.",
  },
  "level-4": {
    code: "elite",
    title: "Level 4 — Elite",
    description: "High-level scaling and capital structuring.",
  },
  "level-5": {
    code: "architect",
    title: "Level 5 — Architect",
    description: "Institutional-grade wealth and global strategy.",
  },
};

export default LEVEL_DEFINITIONS;
