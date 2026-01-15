export type BillingInterval = "month" | "year";

export type Plan = {
  code: PlanCode;
  name: string;
  price: number; // display price only for now
  interval: BillingInterval;
  description: string;
  features: string[];
  rank: number; // higher = more access
};

// ✅ IMPORTANT: include "elite" so your AccessGate can accept required="elite"
export const PLANS = {
  free: {
    code: "free",
    name: "Free",
    price: 0,
    interval: "month",
    description: "Explore the basics and see how the system works.",
    features: [
      "Free starter content",
      "Limited tools access",
      "Email updates (optional)",
    ],
    rank: 0,
  },
  starter: {
    code: "starter",
    name: "Starter",
    price: 9,
    interval: "month",
    description: "For beginners who want structure and momentum.",
    features: [
      "Beginner learning path",
      "Core templates",
      "Weekly action steps",
    ],
    rank: 1,
  },
  builder: {
    code: "builder",
    name: "Builder",
    price: 29,
    interval: "month",
    description: "For serious learners building real habits and systems.",
    features: [
      "Intermediate learning path",
      "Downloadables + checklists",
      "Toolkits and calculators",
    ],
    rank: 2,
  },
  pro: {
    code: "pro",
    name: "Pro",
    price: 79,
    interval: "month",
    description: "For entrepreneurs scaling and tightening execution.",
    features: [
      "Advanced modules",
      "Priority templates",
      "Playbooks for execution",
    ],
    rank: 3,
  },
  founder: {
    code: "founder",
    name: "Founder",
    price: 149,
    interval: "month",
    description: "For leaders building the full machine and long-term assets.",
    features: [
      "Founder-level systems",
      "Strategy frameworks",
      "Premium resources library",
    ],
    rank: 4,
  },
  elite: {
    code: "elite",
    name: "Elite",
    price: 299,
    interval: "month",
    description: "Highest tier. Full access + concierge-level structure.",
    features: [
      "Everything in Founder",
      "Elite-only resources",
      "Priority support channel (future)",
    ],
    rank: 5,
  },
} as const;

// ✅ This is what your build is complaining about being missing
export type PlanCode = keyof typeof PLANS;

// Helpful exports (optional, but nice)
export const PLAN_CODES = Object.keys(PLANS) as PlanCode[];
export const DEFAULT_PLAN: PlanCode = "free";

export function isPlanCode(x: unknown): x is PlanCode {
  return typeof x === "string" && (x as string) in PLANS;
}

export function planRank(code: PlanCode): number {
  return PLANS[code].rank;
}

export function hasAccess(user: PlanCode, required: PlanCode): boolean {
  return planRank(user) >= planRank(required);
}
