// data/plans/us.plans.ts

/**
 * Canonical list of plans for the US site
 * This file is the single source of truth for plan identifiers
 */

export const PLANS = {
  free: {
    label: "Free",
    price: 0,
  },

  starter: {
    label: "Starter",
    price: 9,
  },

  pro: {
    label: "Pro",
    price: 29,
  },

  builder: {
    label: "Builder",
    price: 79,
  },
} as const;

/**
 * PlanCode is derived from PLANS keys
 * DO NOT hardcode elsewhere
 */
export type PlanCode = keyof typeof PLANS;
