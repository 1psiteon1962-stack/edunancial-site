// types/plan.ts

export const PLANS = {
  free: {
    label: "Free",
    price: 0,
    level: 1,
    features: ["Public content", "Level 1 training"]
  },

  starter: {
    label: "Starter",
    price: 4.99,
    level: 2,
    features: ["Level 2 training", "Basic tools", "Community access"]
  },

  builder: {
    label: "Builder",
    price: 9.99,
    level: 3,
    features: ["Level 3 training", "Business tools", "KPI tracking"]
  },

  pro: {
    label: "Pro",
    price: 49,
    level: 4,
    features: ["Level 4 systems", "Entity planning", "Capital prep"]
  },

  founder: {
    label: "Founder",
    price: 199,
    level: 5,
    features: ["Level 5 strategy", "Global structuring", "Investor readiness"]
  },

  elite: {
    label: "Elite",
    price: 999,
    level: 6,
    features: [
      "Institutional structuring",
      "Cross-border entity design",
      "Capital stack modeling",
      "Private incubator access",
      "Investor & UDL legal routing"
    ]
  }
} as const;

export type PlanCode = keyof typeof PLANS;

export type Plan = (typeof PLANS)[PlanCode];

export const PLAN_LABELS: Record<PlanCode, string> = {
  free: "Free",
  starter: "Starter",
  builder: "Builder",
  pro: "Pro",
  founder: "Founder",
  elite: "Elite"
};
