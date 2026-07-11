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
  },

  "latin-america": {
    heroTitle: "Latin America",
    description:
      "Two-segment regional architecture covering Mexico & Central America (Segment A) and South America (Segment B).",
    sections: [
      {
        id: "latam-a-1",
        title: "Mexico & Central America — Segment A",
        body:
          "Serving Spanish-speaking Central American markets including Mexico, Guatemala, Honduras, El Salvador, Nicaragua, Costa Rica, and Panama."
      },
      {
        id: "latam-b-1",
        title: "South America — Segment B",
        body:
          "Serving all South American economies including Brazil, Argentina, Colombia, Peru, Chile, and beyond."
      }
    ]
  },

  europe: {
    heroTitle: "Europe",
    description:
      "Two-segment European architecture covering Western Europe (2A) and Central & Eastern Europe (2B).",
    sections: [
      {
        id: "eu-2a-1",
        title: "Western Europe — Segment 2A",
        body:
          "Serving UK, France, Germany, Spain, Italy, Netherlands, Belgium, Sweden, Switzerland, Austria, and allied Western European markets."
      },
      {
        id: "eu-2b-1",
        title: "Central & Eastern Europe — Segment 2B",
        body:
          "Serving Poland, Romania, Czech Republic, Hungary, Greece, Portugal, Croatia, Slovakia, Bulgaria, and other Central and Eastern European markets."
      }
    ]
  },

  caribbean: {
    heroTitle: "Caribbean",
    description:
      "Multi-jurisdictional financial education infrastructure for Caribbean island economies.",
    sections: [
      {
        id: "caribbean-1",
        title: "Island Economy Realities",
        body:
          "Caribbean founders navigate small open economies, tourism dependency, and remittance flows. Financial strategy must account for these structural realities."
      },
      {
        id: "caribbean-2",
        title: "Multi-Language Delivery",
        body:
          "Caribbean markets span English, Spanish, and French-speaking territories. Curriculum architecture supports all three language tracks."
      }
    ]
  },

  "middle-east": {
    heroTitle: "Middle East",
    description:
      "Financial competency education aligned to GCC and MENA market structures, Islamic finance principles, and multi-language delivery.",
    sections: [
      {
        id: "mena-1",
        title: "GCC High-Growth Markets",
        body:
          "Saudi Arabia, UAE, Qatar, and allied GCC markets represent some of the world's fastest capital-forming environments."
      },
      {
        id: "mena-2",
        title: "Islamic Finance Alignment",
        body:
          "Curriculum architecture is designed to incorporate Islamic finance principles alongside conventional financial frameworks."
      }
    ]
  },

  "asia-pacific": {
    heroTitle: "Asia-Pacific",
    description:
      "The world's most economically diverse regional block — spanning East Asia, Southeast Asia, South Asia, and Oceania.",
    sections: [
      {
        id: "apac-1",
        title: "Economic Diversity",
        body:
          "Asia-Pacific spans advanced economies (Japan, Australia, South Korea), high-growth markets (India, Vietnam, Indonesia), and established financial centers (Singapore, Hong Kong)."
      },
      {
        id: "apac-2",
        title: "Multi-Language Infrastructure",
        body:
          "Curriculum delivery architecture supports English, Chinese, Japanese, Korean, Hindi, Indonesian, and Vietnamese language tracks."
      }
    ]
  }
};
