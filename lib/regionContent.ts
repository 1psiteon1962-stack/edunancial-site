export type RegionSectionContent = {
  id: string;
  title: string;
  body: string;
};

export type RegionPageContent = {
  heroTitle: string;
  description: string;
  sections: RegionSectionContent[];
};

export const regionContent: Record<string, RegionPageContent> = {
  us: {
    heroTitle: "Building Businesses in the United States",
    description:
      "Regulatory awareness, capital access, and operational discipline for founders operating in the U.S. market.",
    sections: [
      {
        id: "us-1",
        title: "Regulation as a Competitive Reality",
        body:
          "In the United States, compliance is not optional. Understanding it early reduces friction, cost, and future risk."
      },
      {
        id: "us-2",
        title: "Capital Formation",
        body:
          "U.S. founders face both opportunity and scrutiny. Structure determines who can fund you and how fast."
      }
    ]
  },

  africa: {
    heroTitle: "Entrepreneurship Across African Markets",
    description:
      "Operating in high-growth environments shaped by infrastructure gaps, currency dynamics, and regulatory diversity.",
    sections: [
      {
        id: "africa-1",
        title: "Infrastructure Bottlenecks",
        body:
          "African founders often scale despite infrastructure limitations. Strategy must account for power, logistics, and payments."
      },
      {
        id: "africa-2",
        title: "Cross-Border Expansion",
        body:
          "Many African businesses are regional by necessity. Planning early for cross-border compliance is critical."
      }
    ]
  },

  latam: {
    heroTitle: "Latin America & the Caribbean",
    description:
      "Navigating informality, regulation, and growth opportunities across Latin American economies.",
    sections: [
      {
        id: "latam-1",
        title: "Informality vs Structure",
        body:
          "Many businesses begin informally. Transitioning to structure unlocks capital, partnerships, and protection."
      },
      {
        id: "latam-2",
        title: "Currency & Political Risk",
        body:
          "Financial planning must anticipate volatility, controls, and regulatory shifts."
      }
    ]
  }
};
