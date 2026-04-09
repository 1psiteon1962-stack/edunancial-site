export type Level =
  | "starter"
  | "growth"
  | "pro"
  | "enterprise"
  | "elite"

export type Offer = {
  title: string
  description: string
}

export const LevelOffers: Record<Level, Offer[]> = {
  starter: [
    {
      title: "Starter Tools",
      description: "Basic financial education and entry-level tools",
    },
  ],
  growth: [
    {
      title: "Growth Systems",
      description: "Scaling strategies and structured business systems",
    },
  ],
  pro: [
    {
      title: "Professional Tools",
      description: "Advanced analytics and investment frameworks",
    },
  ],
  enterprise: [
    {
      title: "Enterprise Access",
      description: "Full-scale systems, governance, and expansion tools",
    },
  ],
  elite: [
    {
      title: "Elite Access",
      description: "Highest-level strategy, capital structuring, and scaling",
    },
  ],
}
