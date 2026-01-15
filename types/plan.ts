export const PLANS = {
  free: {
    code: "free",
    label: "Free",
    name: "Free",
    description: "Public tools and basic access",
    price: 0,
    interval: "month",
    rank: 0
  },
  starter: {
    code: "starter",
    label: "Starter",
    name: "Starter",
    description: "Entry-level business tools",
    price: 19,
    interval: "month",
    rank: 1
  },
  builder: {
    code: "builder",
    label: "Builder",
    name: "Builder",
    description: "Full system access",
    price: 49,
    interval: "month",
    rank: 2
  },
  pro: {
    code: "pro",
    label: "Pro",
    name: "Pro",
    description: "Scaling & automation",
    price: 99,
    interval: "month",
    rank: 3
  },
  founder: {
    code: "founder",
    label: "Founder",
    name: "Founder",
    description: "Ownership-level access",
    price: 299,
    interval: "month",
    rank: 4
  },
  elite: {
    code: "elite",
    label: "Elite",
    name: "Elite",
    description: "Private capital & global expansion",
    price: 999,
    interval: "month",
    rank: 5
  }
} as const;

/* ================= TYPES ================= */

export type PlanCode = keyof typeof PLANS;
export type PlanTier = PlanCode;
export type Plan = (typeof PLANS)[PlanCode];

/* ================= HELPERS ================= */

export const DEFAULT_PLAN: PlanCode = "free";

export function isPlanCode(value: string): value is PlanCode {
  return value in PLANS;
}

export function hasAccess(
  userPlan: PlanCode,
  requiredPlan: PlanCode
): boolean {
  return PLANS[userPlan].rank >= PLANS[requiredPlan].rank;
}
