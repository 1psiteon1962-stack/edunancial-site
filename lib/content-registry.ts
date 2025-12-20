// lib/content-registry.ts
// Single source of truth for ALL regions
// Safe for Netlify, Next.js App Router, TS strict

export type Region =
  | "us"
  | "africa"
  | "india"
  | "global";

export type ContentBlock = {
  title: string;
  body: string;
};

export type RegionContent = {
  hero: ContentBlock;
  mission: ContentBlock;
  focus: ContentBlock;
};

export const CONTENT_REGISTRY: Record<Region, RegionContent> = {
  us: {
    hero: {
      title: "Financial Literacy for Builders, Not Spectators",
      body:
        "Edunancial exists to equip founders, families, and future leaders with real financial literacy — not motivation, not theory, but decision-making power."
    },
    mission: {
      title: "Our Mission",
      body:
        "To provide structured financial literacy across generations, empowering people to build, protect, and scale capital responsibly."
    },
    focus: {
      title: "United States Focus",
      body:
        "Entrepreneurs, founders, families, and youth preparing for real economic participation."
    }
  },

  africa: {
    hero: {
      title: "Financial Literacy for Growth Economies",
      body:
        "Education without financial literacy creates dependency. Edunancial Africa focuses on ownership, capital discipline, and generational progress."
    },
    mission: {
      title: "Our Mission",
      body:
        "To support emerging markets with practical financial literacy designed for builders, not consumers."
    },
    focus: {
      title: "Africa Focus",
      body:
        "Entrepreneurs, youth, and families in growth-stage economies."
    }
  },

  india: {
    hero: {
      title: "Financial Literacy for Scale and Innovation",
      body:
        "India’s growth demands disciplined capital literacy. Edunancial India focuses on structured thinking for founders and families."
    },
    mission: {
      title: "Our Mission",
      body:
        "To support innovation with financial structure, governance, and long-term thinking."
    },
    focus: {
      title: "India Focus",
      body:
        "Founders, technologists, and multi-generation households."
    }
  },

  global: {
    hero: {
      title: "Global Financial Literacy",
      body:
        "Financial literacy is the foundation of sovereignty. Edunancial Global unifies principles across regions."
    },
    mission: {
      title: "Our Mission",
      body:
        "To deliver consistent, structured financial literacy worldwide."
    },
    focus: {
      title: "Global Focus",
      body:
        "Builders everywhere."
    }
  }
};
