// data/us/levels.ts

import type { LevelSpec } from "../../types/level";

export const US_LEVELS: LevelSpec[] = [
  {
    code: "L1",
    title: "Level 1",
    description: "Core fundamentals and your first build steps.",
    requires: "free",
  },
  {
    code: "L2",
    title: "Level 2",
    description: "Intermediate systems and execution discipline.",
    requires: "starter",
  },
  {
    code: "L3",
    title: "Level 3",
    description: "Scaling, automation, and growth mechanics.",
    requires: "pro",
  },
  {
    code: "L4",
    title: "Level 4",
    description: "Advanced strategy, governance, and capital readiness.",
    requires: "elite",
  },
  {
    code: "L5",
    title: "Level 5",
    description: "Empire builder / capital architect playbooks.",
    requires: "enterprise",
  },
];
