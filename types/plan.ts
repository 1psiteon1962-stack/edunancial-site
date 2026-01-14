export const PLANS = {
  free: {
    label: "Free",
    price: 0,
    description: "Public access and previews"
  },

  starter: {
    label: "Starter",
    price: 29,
    description: "Beginner entrepreneur curriculum"
  },

  builder: {
    label: "Builder",
    price: 79,
    description: "Operating systems, compliance, and funding readiness"
  },

  pro: {
    label: "Pro",
    price: 199,
    description: "Advanced structuring and scaling"
  },

  founder: {
    label: "Founder",
    price: 499,
    description: "Private founder systems and deal access"
  },

  elite: {
    label: "Elite",
    price: 1499,
    description: "Investor-grade, incubator-connected, legal-ready founders"
  }
} as const

export type PlanCode = keyof typeof PLANS

export const PLAN_LABELS: Record<PlanCode, string> = {
  free: "Free",
  starter: "Starter",
  builder: "Builder",
  pro: "Pro",
  founder: "Founder",
  elite: "Elite"
}
