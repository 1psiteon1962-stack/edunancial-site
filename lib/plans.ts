// lib/plans.ts

export type PlanCode =
  | "free"
  | "starter"
  | "founder"
  | "pro"
  | "elite"
  | "enterprise";

export const PLAN_RANK: Record<PlanCode, number> = {
  free: 0,
  starter: 1,
  founder: 2,
  pro: 3,
  elite: 4,
  enterprise: 5,
};

export const PLAN_LABEL: Record<PlanCode, string> = {
  free: "Free",
  starter: "Starter",
  founder: "Founder",
  pro: "Pro",
  elite: "Elite",
  enterprise: "Enterprise",
};
