export const PLANS = {
  free: {
    code: "free",
    label: "Free",
    name: "Free",
    description: "Basic access to public tools",
    price: 0,
    interval: "month",
    rank: 0,
    features: ["Public tools", "Community access"]
  },
  starter: {
    code: "starter",
    label: "Starter",
    name: "Starter",
    description: "Entry level business tools",
    price: 19,
    interval: "month",
    rank: 1,
    features: ["Private tools", "Email support"]
  },
  builder: {
    code: "builder",
    label: "Builder",
    name: "Builder",
    description: "Full business buildout",
    price: 49,
    interval: "month",
    rank: 2,
    features: ["AI tools", "Dashboards", "Priority support"]
  },
  pro: {
    code: "pro",
    label: "Pro",
    name: "Pro",
    description: "Scaling systems unlocked",
    price: 99,
    interval: "month",
    rank: 3,
    features: ["Automation", "APIs", "Advanced reporting"]
  },
  founder: {
    code: "founder",
    label: "Founder",
    name: "Founder",
    description: "Ownership-level access",
    price: 299,
    interval: "month",
    rank: 4,
    features: ["Private groups", "Equity tools", "Founder calls"]
  }
} as const;

/* ===== TYPES ===== */

export type PlanCode = keyof typeof PLANS;

/** Older code used PlanTier — it is now a strict alias */
export type PlanTier = PlanCode;

export type Plan = (typeof PLANS)[PlanCode];
