// types/plan.ts

export const PLANS = {
  free: {
    label: "Free",
    price: 0,
    features: ["Public access"]
  },

  starter: {
    label: "Starter",
    price: 9,
    features: ["Starter tools", "Community"]
  },

  builder: {
    label: "Builder",
    price: 29,
    features: ["Apps", "Training"]
  },

  pro: {
    label: "Pro",
    price: 79,
    features: ["Dashboards", "Investor tools"]
  },

  founder: {
    label: "Founder",
    price: 199,
    features: ["Capital rooms", "Deal flow"]
  },

  elite: {
    label: "Elite",
    price: 499,
    features: ["Syndicates", "Direct legal & capital"]
  }
} as const;

/**
 * This is what your pages are importing
 */
export type PlanCode = keyof typeof PLANS;
