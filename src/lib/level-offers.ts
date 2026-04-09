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
  priceUSD: number
  comingSoon?: boolean
}

export const LEVEL_OFFERS: Record<Level, Offer[]> = {
  starter: [
    {
      id: "starter-1",
      title: "Starter Tools",
      description: "Basic financial education and entry-level tools",
      priceUSD: 9,
      comingSoon: false,
    },
  ],
  growth: [
    {
      id: "growth-1",
      title: "Growth Systems",
      description: "Scaling strategies and structured business systems",
      priceUSD: 49,
      comingSoon: false,
    },
  ],
  pro: [
    {
      id: "pro-1",
      title: "Professional Tools",
      description: "Advanced analytics and investment frameworks",
      priceUSD: 99,
      comingSoon: false,
    },
  ],
  enterprise: [
    {
      id: "enterprise-1",
      title: "Enterprise Access",
      description: "Full-scale systems, governance, and expansion tools",
      priceUSD: 199,
      comingSoon: true,
    },
  ],
  elite: [
    {
      id: "elite-1",
      title: "Elite Access",
      description: "Top-tier capital structuring and global scaling",
      priceUSD: 499,
      comingSoon: true,
    },
  ],
}
