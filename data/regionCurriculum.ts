export const REGION_CURRICULUM: Record<
  string,
  {
    focusAreas: readonly string[];
  }
> = {
  us: {
    focusAreas: [
      "Personal finance",
      "Business formation",
      "Credit systems",
      "Investing fundamentals",
    ],
  },

  latam: {
    focusAreas: [
      "Entrepreneurship and business formation",
      "Currency risk and economic resilience",
      "Cross-border trade and LATAM agreements",
      "Investment and capital access",
      "Taxation and compliance by country",
    ],
  },

  mena: {
    focusAreas: [
      "Entrepreneurship",
      "Digital commerce",
      "Cross-border finance",
    ],
  },

  europe: {
    focusAreas: [
      "Compliance-aware investing",
      "Wealth preservation",
      "Corporate governance",
    ],
  },

  "asia-pacific": {
    focusAreas: [
      "Mobile finance",
      "Platform economics",
      "Global trade literacy",
    ],
  },

  "asia-emerging": {
    focusAreas: [
      "Foundational finance",
      "Micro-entrepreneurship",
      "Capital access",
    ],
  },

  caribbean: {
    focusAreas: [
      "Bilingual business education",
      "Diaspora investing",
      "Cross-border structuring",
    ],
  },
};
