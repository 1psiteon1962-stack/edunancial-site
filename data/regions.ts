export const REGIONS = {
  us: {
    name: "United States",
    description: "Primary launch market with full product access",
    maturity: "developed",
  },

  mena: {
    name: "Middle East & North Africa",
    description: "Rapid digital adoption with regulatory sensitivity",
    maturity: "emerging",
  },

  europe: {
    name: "Europe",
    description: "Highly regulated but high purchasing power markets",
    maturity: "developed",
  },

  "asia-pacific": {
    name: "Asia Pacific",
    description: "Large population, strong mobile-first adoption",
    maturity: "mixed",
  },

  "asia-emerging": {
    name: "Asia Emerging",
    description: "Fast-growing economies with price sensitivity",
    maturity: "emerging",
  },

  caribbean: {
    name: "Caribbean",
    description: "Cross-border, bilingual, and diaspora-driven markets",
    maturity: "emerging",
  },
} as const;

export type RegionKey = keyof typeof REGIONS;
