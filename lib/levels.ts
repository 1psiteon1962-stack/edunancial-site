// lib/levels.ts

export type Level = 1 | 2 | 3 | 4 | 5;

export type LevelMeta = {
  id: Level;
  title: string;
  description: string;
};

export const EDUNANCIAL_LEVELS: LevelMeta[] = [
  {
    id: 1,
    title: "Level 1 — Foundation",
    description: "Basics: budgeting, saving, avoiding common money traps.",
  },
  {
    id: 2,
    title: "Level 2 — Builder",
    description: "Build credit, stabilize income, start investing fundamentals.",
  },
  {
    id: 3,
    title: "Level 3 — Investor",
    description: "Portfolio building, risk control, long-term strategy.",
  },
  {
    id: 4,
    title: "Level 4 — Operator",
    description: "Business + assets: systems, leverage, scaling mindset.",
  },
  {
    id: 5,
    title: "Level 5 — Architect",
    description: "Advanced strategy: allocation, governance, global thinking.",
  },
];

export function hasSufficientLevel(required: Level, current: Level): boolean {
  return current >= required;
}
