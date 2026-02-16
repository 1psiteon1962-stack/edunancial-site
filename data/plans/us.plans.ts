// data/plans/us.plans.ts

export const PLANS = {
  free: {
    name: "Free",
    price: 0,
  },
  starter: {
    name: "Starter",
    price: 19,
  },
  pro: {
    name: "Pro",
    price: 49,
  },
  builder: {
    name: "Builder",
    price: 99,
  },
} as const;

/**
 * PlanCode is derived directly from PLANS keys.
 * This guarantees type safety across the app.
 */
export type PlanCode = keyof typeof PLANS;
