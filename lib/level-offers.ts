export type Level = "starter" | "growth" | "enterprise";

export interface Offer {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  comingSoon?: boolean;
}

export const LEVEL_OFFERS: Record<Level, Offer[]> = {
  starter: [
    {
      id: "starter-1",
      title: "Starter Pack",
      description: "Basic tools to begin",
      priceUSD: 9,
    },
  ],
  growth: [
    {
      id: "growth-1",
      title: "Growth Pack",
      description: "Scaling systems",
      priceUSD: 29,
    },
  ],
  enterprise: [
    {
      id: "enterprise-1",
      title: "Enterprise Pack",
      description: "Full access",
      priceUSD: 99,
    },
  ],
};
