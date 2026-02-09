// src/constants/levels.ts

/**
 * Allowed subscription / access plans
 * Centralized so ALL gating logic shares the same contract
 */
export type PlanCode =
  | "free"
  | "starter"
  | "pro"
  | "builder"
  | "elite"
  | "enterprise";

/**
 * Canonical definition of an education / access level
 * This is the SINGLE SOURCE OF TRUTH
 */
export interface LevelDefinition {
  level: number;
  slug: string;
  title: string;
  description: string;

  /**
   * Plan required to access this level
   * MUST exist because AccessGate requires it
   */
  requiredPlan: PlanCode;
}

/**
 * Ordered list of level definitions.
 * - MUST be an array
 * - Index-based access is intentional
 */
export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    level: 1,
    slug: "foundations",
    title: "Foundations",
    description: "Core financial and business literacy fundamentals.",
    requiredPlan: "free",
  },
  {
    level: 2,
    slug: "intermediate",
    title: "Intermediate",
    description: "Applied financial concepts and real-world use cases.",
    requiredPlan: "starter",
  },
  {
    level: 3,
    slug: "advanced",
    title: "Advanced",
    description: "Systems thinking, leverage, and capital efficiency.",
    requiredPlan: "pro",
  },
  {
    level: 4,
    slug: "builder",
    title: "Builder",
    description: "Business construction, scaling, and governance.",
    requiredPlan: "builder",
  },
  {
    level: 5,
    slug: "elite",
    title: "Elite",
    description: "Institutional-level strategy and capital deployment.",
    requiredPlan: "elite",
  },
];
