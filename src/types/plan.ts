// src/types/plan.ts

/**
 * Subscription Plans + Access Control
 * Netlify build requires PlanCode to include every plan used in AccessGate.
 */

export type PlanCode =
  | "free"
  | "starter"
  | "growth"
  | "builder"
  | "pro"
  | "enterprise";

export type Plan = {
  code: PlanCode;
  label: string;
  priceMonthly: number;
  description: string;
};

export const PLANS: Record<PlanCode, Plan> = {
  free: {
    code: "free",
    label: "Free",
    priceMonthly: 0,
    description: "Basic public access"
  },

  starter: {
    code: "starter",
    label: "Starter",
    priceMonthly: 9,
    description: "Entry-level tools and learning"
  },

  growth: {
    code: "growth",
    label: "Growth",
    priceMonthly: 29,
    description: "Intermediate scaling and expansion tools"
  },

  builder: {
    code: "builder",
    label: "Builder",
    priceMonthly: 49,
    description: "Business building + KPI systems"
  },

  pro: {
    code: "pro",
    label: "Pro",
    priceMonthly: 99,
    description: "Advanced investor-grade tools"
  },

  enterprise: {
    code: "enterprise",
    label: "Enterprise",
    priceMonthly: 199,
    description: "Full access + institutional features"
  }
};

/**
 * Normalize user-entered plan values safely.
 */
export function normalizePlan(input: string): PlanCode {
  const cleaned = input.trim().toLowerCase();

  if (cleaned in PLANS) {
    return cleaned as PlanCode;
  }

  return "free";
}
