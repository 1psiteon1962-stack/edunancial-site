export const PLANS = {
  free: {
    label: "Free",
    price: 0,
    description: "Public access and basic previews"
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
    description: "Advanced structuring, global scaling, and investor prep"
  },

  founder: {
    label: "Founder",
    price: 499,
    description: "Private founder access, deal flow, and legal-grade readiness"
  }
} as const

// THIS is what Netlify has been missing
export type PlanCode = keyof typeof PLANS

// Optional helpers (safe to keep)
export const PLAN_LABELS: Record<PlanCode, string> = {
  free: "Free",
  starter: "Starter",
  builder: "Builder",
  pro: "Pro",
  founder: "Founder"
}
