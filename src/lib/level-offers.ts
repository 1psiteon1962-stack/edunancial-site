export type Level =
  | "starter"
  | "growth"
  | "pro"
  | "enterprise"
  | "elite"

export type Offer = {
  id: string
  title: string
  description: string
}

export const LevelOffers: Record<Level, Offer[]> = {
  starter: [
    {
      id: "starter-1",
      title: "Starter Tools",
      description: "Basic financial education and entry-level tools",
    },
  ],
  growth: [
    {
      id: "growth-1",
      title: "Growth Systems",
      description: "Scaling strategies and structured business systems",
    },
  ],
  pro: [
    {
      id: "pro-1",
      title: "Professional Tools",
      description: "Advanced analytics and investment frameworks",
    },
  ],
  enterprise: [
    {
      id: "enterprise-1",
      title: "Enterprise Access",
      description: "Full-scale systems, governance, and expansion tools",
    },
  ],
  elite: [
    {
      id: "elite-1",
      title: "Elite Access",
      description: "Highest-level strategy, capital structuring, and scaling",
    },
  ],
}
