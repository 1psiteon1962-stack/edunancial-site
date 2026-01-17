// data/us/levels.ts

import type { LevelDefinition } from "../../types/level";

export const US_LEVELS: LevelDefinition[] = [
  {
    id: "level-1",
    code: "level-1",
    title: "Level 1",
    description: "Foundational financial literacy and tools.",
    requires: "free",
  },
  {
    id: "level-2",
    code: "level-2",
    title: "Level 2",
    description: "Intermediate planning and strategy.",
    requires: "starter",
  },
  {
    id: "level-3",
    code: "level-3",
    title: "Level 3",
    description: "Advanced execution and optimization.",
    requires: ["pro"],
  },
];
