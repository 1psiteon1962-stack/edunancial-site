// src/constants/levels.ts

/**
 * Canonical definition of an education / access level
 */
export interface LevelDefinition {
  level: number;
  slug: string;
  title: string;
  description: string;
  minimumPlan?: "free" | "starter" | "pro" | "builder" | "elite" | "enterprise";
}

/**
 * Ordered list of level definitions.
 * IMPORTANT:
 * - This MUST be an array
 * - Order matters
 * - Indexed access is intentional
 */
export const LEVEL_DEFINITIONS: LevelDefinition[] = [
  {
    level: 1,
    slug: "foundations",
    title: "Foundations",
    description: "Core financial and business literacy fundamentals.",
    minimumPlan: "free",
  },
  {
    level: 2,
    slug: "intermediate",
    title: "Intermediate",
    description: "Applied financial concepts and real-world use cases.",
    minimumPlan: "starter",
  },
  {
    level: 3,
    slug: "advanced",
    title: "Advanced",
    description: "Systems thinking, leverage, and capital efficiency.",
    minimumPlan: "pro",
  },
  {
    level: 4,
    slug: "builder",
    title: "Builder",
    description: "Business construction, scaling, and governance.",
    minimumPlan: "builder",
  },
  {
    level: 5,
    slug: "elite",
    title: "Elite",
    description: "Institutional-level strategy and capital deployment.",
    minimumPlan: "elite",
  },
];
