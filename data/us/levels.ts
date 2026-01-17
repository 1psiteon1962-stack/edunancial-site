// data/us/levels.ts

import type { LevelDefinition } from "@/types/level";

export const US_LEVELS: LevelDefinition[] = [
  {
    id: "level-1",
    code: "level-1",
    title: "Level 1 — Foundations",
    description: "Understanding money at the personal level.",
    outcomes: [
      "Understand income vs expenses",
      "Recognize basic cash flow",
      "Identify short-term vs long-term thinking"
    ]
  },
  {
    id: "level-2",
    code: "level-2",
    title: "Level 2 — Structure",
    description: "Understanding how financial systems are organized.",
    outcomes: [
      "Understand assets vs liabilities",
      "Learn how ownership works",
      "Recognize financial rules and structure"
    ]
  },
  {
    id: "level-3",
    code: "level-3",
    title: "Level 3 — Strategy",
    description: "Understanding decisions, risk, and trade-offs.",
    outcomes: [
      "Evaluate risk vs reward",
      "Understand leverage",
      "Think before acting"
    ],
    requires: "starter"
  },
  {
    id: "level-4",
    code: "level-4",
    title: "Level 4 — Growth",
    description: "Understanding scale, protection, and sustainability.",
    outcomes: [
      "Understand compounding",
      "Recognize growth risks",
      "
