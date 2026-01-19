// data/us/levels.ts

/**
 * IMPORTANT:
 * This file intentionally uses a LOCAL type definition
 * instead of "@/types/level" to avoid Netlify/Linux
 * path-alias resolution failures.
 */

/** Local copy of LevelDefinition — DO NOT IMPORT */
export interface LevelDefinition {
  id: string;
  name: string;
  description: string;
  requiredPlan?: string;
}

export const US_LEVELS: LevelDefinition[] = [
  {
    id: "level-1",
    name: "Level 1",
    description: "Foundational access and introductory tools.",
    requiredPlan: "free",
  },
  {
    id: "level-2",
    name: "Level 2",
    description: "Starter financial and planning tools.",
    requiredPlan: "starter",
  },
  {
    id: "level-3",
    name: "Level 3",
    description: "Intermediate analysis and reporting.",
    requiredPlan: "basic",
  },
  {
    id: "level-4",
    name: "Level 4",
    description: "Advanced modeling and automation.",
    requiredPlan: "pro",
  },
  {
    id: "level-5",
    name: "Level 5",
    description: "Enterprise-grade tools and intelligence.",
    requiredPlan: "enterprise",
  },
];
