// lib/levels.ts

export type LiteracyLevel = 1 | 2 | 3 | 4 | 5;

export type LevelMeta = {
  label: string;
  description: string;
  features: string[];
  monetizable?: boolean;
};

export const LEVEL_META: Record<LiteracyLevel, LevelMeta> = {
  1: {
    label: "Foundation",
    description: "Basic financial literacy and core concepts.",
    features: ["Budgeting", "Saving", "Financial vocabulary"],
    monetizable: false,
  },
  2: {
    label: "Growth",
    description: "Understanding credit, debt, and basic investing.",
    features: ["Credit scores", "Debt management", "Intro investing"],
    monetizable: false,
  },
  3: {
    label: "Wealth",
    description: "Intermediate investing and asset building.",
    features: ["Stocks", "ETFs", "Real estate basics"],
    monetizable: true,
  },
  4: {
    label: "Scale",
    description: "Advanced strategies and financial leverage.",
    features: ["Options", "Business ownership", "Tax strategy"],
    monetizable: true,
  },
  5: {
    label: "Capital Architect",
    description: "Institutional-level capital thinking.",
    features: ["Private equity", "Deal structuring", "Capital stacks"],
    monetizable: true,
  },
};

export const LEVEL_LABELS: Record<LiteracyLevel, string> = {
  1: "Foundation",
  2: "Growth",
  3: "Wealth",
  4: "Scale",
  5: "Capital Architect",
};
