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
    features: ["Dashboards", "Investing"]
  },

  founder: {
    label: "Founder",
    price: 199,
    features: ["Capital rooms", "Deal flow"]
  },

  elite: {
    label: "Elite",
    price: 499,
    features: ["Syndicates", "Direct access"]
  }
} as const;

/**
 * This is what your pages import
 */
export type PlanCode = keyof typeof PLANS;

export type Plan = (typeof PLANS)[PlanCode];
