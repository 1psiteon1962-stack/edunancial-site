export type Pricing = {
  currency: string;
  monthly: number;
  quarterly: number;
  annual: number;
  lifetime: number;
};

export type RegionCurriculumContent = {
  title: string;
  description: string;
  curriculum: string[];
  pricing: Pricing;
};

export const regionContent: Record<string, Record<string, RegionCurriculumContent>> = {
  africa: {
    en: {
      title: "Africa Foundational Curriculum",
      description: "Practical financial literacy and entrepreneurship for African markets.",
      curriculum: [
        "Personal finance fundamentals",
        "Mobile banking & fintech",
        "Small business formation",
        "Local market investing",
        "Cross-border trade basics",
      ],
      pricing: {
        currency: "USD",
        monthly: 9,
        quarterly: 25,
        annual: 90,
        lifetime: 299,
      },
    },
  },

  "asia-emerging": {
    en: {
      title: "Asia Emerging Markets Curriculum",
      description: "Capital formation and business skills for emerging Asian economies.",
      curriculum: [
        "Savings & capital discipline",
        "Microenterprise strategy",
        "Regional supply chains",
        "Export readiness",
        "Digital payments",
      ],
      pricing: {
        currency: "USD",
        monthly: 12,
        quarterly: 33,
        annual: 120,
        lifetime: 349,
      },
    },
  },

  europe: {
    en: {
      title: "Europe Business & Investment Curriculum",
      description: "Regulated-market investing and cross-border business in Europe.",
      curriculum: [
        "EU business structures",
        "Tax-aware investing",
        "Cross-border compliance",
        "Capital markets overview",
        "Entrepreneurial scaling",
      ],
      pricing: {
        currency: "EUR",
        monthly: 15,
        quarterly: 40,
        annual: 150,
        lifetime: 399,
      },
    },
  },
};
