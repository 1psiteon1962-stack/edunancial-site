// types/plan.ts

export const PLANS = {
  free: {
    label: "Free",
    price: 0,
    stripe: "",
    paypal: "",
    features: ["Browse public content"]
  },

  starter: {
    label: "Starter",
    price: 9,
    stripe: "",
    paypal: "",
    features: ["Starter tools", "Community access"]
  },

  builder: {
    label: "Builder",
    price: 29,
    stripe: "",
    paypal: "",
    features: ["All Starter", "Apps", "Training"]
  },

  pro: {
    label: "Pro",
    price: 79,
    stripe: "",
    paypal: "",
    features: ["All Builder", "Investor tools", "Advanced dashboards"]
  },

  founder: {
    label: "Founder",
    price: 199,
    stripe: "",
    paypal: "",
    features: ["All Pro", "Private funding rooms", "Deal access"]
  },

  elite: {
    label: "Elite",
    price: 499,
    stripe: "",
    paypal: "",
    features: ["All Founder", "Private syndicates", "Direct legal & capital"]
  }
} as const;

export type PlanCode = keyof typeof PLANS;

export const PLAN_LABELS: Record<PlanCode, string> = Object.fromEntries(
  Object.entries(PLANS).map(([k, v]) => [k, v.label])
) as Record<PlanCode, string>;
