export type BillingInterval = "month" | "year";

export type PlanCode =
  | "free"
  | "starter"
  | "builder"
  | "pro"
  | "founder"
  | "elite";

export type Plan = {
  code: PlanCode;
  label: string;            // human-readable name
  name: string;             // internal name (same for now)
  price: number;
  interval: BillingInterval;
  description: string;
  features: string[];
  rank: number;             // higher = more access
};

export const PLANS: Record<PlanCode, Plan> = {
  free: {
    code: "free",
    label: "Free",
    name: "Free",
    price: 0,
    interval: "month",
    description: "Explore the platform and see how the system works.",
    features: [
      "Intro content",
      "Limited tools",
      "Email updates",
    ],
    rank: 0,
  },
  starter: {
    code: "starter",
    label: "Starter",
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
    label: "Builder",
    name: "Builder",
    price: 29,
    interval: "month",
    description: "For people building real systems.",
    features: [
      "Intermediate learning path",
      "Downloadable tools",
      "Business checklists",
    ],
    rank: 2,
  },
  pro: {
    code: "pro",
    label: "Pro",
    name: "Pro",
    price: 79,
    interval: "month",
    description: "For entrepreneurs scaling execution.",
    features: [
      "Advanced frameworks",
      "Execution playbooks",
      "Premium templates",
    ],
    rank: 3,
  },
  founder: {
    code: "founder",
    label: "Founder",
    name: "Founder",
    price: 149,
    interval: "month",
    description: "For leaders building long-term machines.",
    features: [
      "Founder-level systems",
      "Strategy frameworks",
      "Capital and structure playbooks",
    ],
    rank: 4,
  },
  elite: {
    code: "elite",
    label: "Elite",
    name: "Elite",
    price: 299,
    interval: "month",
    description: "Highest tier. Full access and priority systems.",
    features: [
      "Everything in Founder",
      "Elite-only resources",
      "Priority support (future)",
    ],
    rank: 5,
  },
};

export const PLAN_CODES = Object.keys(PLANS) as PlanCode[];
export const DEFAULT_PLAN: PlanCode = "free";

export function isPlanCode(x: unknown): x is PlanCode {
  return typeof x === "string" && x in PLANS;
}

export function planRank(code: PlanCode): number {
  return PLANS[code].rank;
}

export function hasAccess(user: PlanCode, required: PlanCode): boolean {
  return planRank(user) >= planRank(required);
}
