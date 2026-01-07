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
