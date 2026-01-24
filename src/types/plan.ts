// src/types/plan.ts

export type PlanCode =
  | "free"
  | "starter"
  | "builder"
  | "pro"
  | "enterprise";

export interface Plan {
  code: PlanCode;
  label: string;
  description: string;
  priceMonthlyUsd: number;
}

export const PLANS: Record<PlanCode, Plan> = {
  free: {
    code: "free",
    label: "Free",
    description: "Basic access to public learning tools.",
    priceMonthlyUsd: 0,
  },

  starter: {
    code: "starter",
    label: "Starter",
    description: "Entry-level tools for new entrepreneurs.",
    priceMonthlyUsd: 9,
  },

  builder: {
    code: "builder",
    label: "Builder",
    description: "Growth tools, templates, and structured programs.",
    priceMonthlyUsd: 49,
  },

  pro: {
    code: "pro",
    label: "Pro",
    description: "Advanced systems, KPI dashboards, and scaling support.",
    priceMonthlyUsd: 99,
  },

  enterprise: {
    code: "enterprise",
    label: "Enterprise",
    description: "Full access + custom consulting + institutional tools.",
    priceMonthlyUsd: 199,
  },
};

/**
 * Normalize a string into a valid plan code.
 * Defaults to "free".
 */
export function normalizePlan(value: unknown): PlanCode {
  if (typeof value !== "string") return "free";

  const v = value.toLowerCase().trim();

  if (v === "starter") return "starter";
  if (v === "builder") return "builder";
  if (v === "pro") return "pro";
  if (v === "enterprise") return "enterprise";

  return "free";
}
