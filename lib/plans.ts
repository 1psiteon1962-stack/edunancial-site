// lib/plans.ts

export type PlanTier =
  | "free"
  | "starter"
  | "founder"
  | "pro"
  | "elite"
  | "enterprise";

export interface Plan {
  key: PlanTier;
  name: string;
  rank: number;
}

export const PLANS: Record<PlanTier, Plan> = {
  free: {
    key: "free",
    name: "Free",
    rank: 0,
  },
  starter: {
    key: "starter",
    name: "Starter",
    rank: 1,
  },
  founder: {
    key: "founder",
    name: "Founder",
    rank: 2,
  },
  pro: {
    key: "pro",
    name: "Pro",
    rank: 3,
  },
  elite: {
    key: "elite",
    name: "Elite",
    rank: 4,
  },
  enterprise: {
    key: "enterprise",
    name: "Enterprise",
    rank: 5,
  },
};
