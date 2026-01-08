// data/regionContent.ts

export interface RegionContent {
  headline: string;
  body: string;
}

export const REGION_CONTENT: Record<string, RegionContent> = {
  us: {
    headline: "Build, Scale, and Protect a Business in the United States",
    body:
      "This section focuses on U.S. entrepreneurship, capital formation, legal structure, and scalable systems.",
  },

  mena: {
    headline: "Entrepreneurship Across MENA Systems",
    body:
      "Content here will address regulatory constraints, fintech access, and regional business norms.",
  },

  europe: {
    headline: "Building Businesses Inside European Frameworks",
    body:
      "European markets reward precision, compliance, and long-term planning.",
  },

  asia_pacific: {
    headline: "Asia-Pacific Advanced Markets",
    body:
      "Japan, Korea, and Australia require disciplined execution and institutional awareness.",
  },

  asia_emerging: {
    headline: "Emerging Asian Economies",
    body:
      "High-growth markets with unique payment, compliance, and infrastructure challenges.",
  },

  caribbean: {
    headline: "Caribbean Entrepreneurship",
    body:
      "Cross-border finance, multilingual markets, and regional opportunity.",
  },
};
