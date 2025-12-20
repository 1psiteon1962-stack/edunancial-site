// lib/level-offers.ts
// Canonical monetization map by Level (internal authority)

export type Level = 1 | 2 | 3 | 4 | 5;

export interface Offer {
  id: string;
  title: string;
  description: string;
  priceUSD: number;
  tier: "BASIC" | "ADVANCED" | "ELITE";
  comingSoon?: boolean;
}

export const LevelOffers: Record<Level, Offer[]> = {
  1: [
    {
      id: "l1-foundations",
      title: "Financial Literacy Foundations",
      description: "Understand money, cash flow, and personal control.",
      priceUSD: 29,
      tier: "BASIC",
    },
  ],

  2: [
    {
      id: "l2-credit-cashflow",
      title: "Credit & Cash Flow Control",
      description: "Personal and small business financial control systems.",
      priceUSD: 99,
      tier: "ADVANCED",
    },
  ],

  3: [
    {
      id: "l3-investing-logic",
      title: "Investing Logic & Risk Structure",
      description: "Evaluate deals before risking capital.",
      priceUSD: 249,
      tier: "ADVANCED",
    },
  ],

  4: [
    {
      id: "l4-entities-capital",
      title: "Entity Structure & Capital Strategy",
      description: "Companies, capital, protection, and scaling logic.",
      priceUSD: 499,
      tier: "ELITE",
    },
  ],

  5: [
    {
      id: "l5-capital-architecture",
      title: "Capital Architecture & Global Strategy",
      description: "Institutional-level thinking and capital design.",
      priceUSD: 999,
      tier: "ELITE",
      comingSoon: true,
    },
  ],
};
