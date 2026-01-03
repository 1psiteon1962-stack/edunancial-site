// lib/regionCurriculumContent.ts

import type { RegionKey } from "./regions";
import type { Language } from "./i18n";

export type RegionCurriculumContent = {
  heroTitle: string;
  description: string;
};

export const regionCurriculumContent: Record<
  RegionKey,
  Record<Language, RegionCurriculumContent>
> = {
  us: {
    en: {
      heroTitle: "U.S. Financial Literacy",
      description: "Understand money, credit, and systems in the U.S.",
    },
  },

  europe: {
    en: {
      heroTitle: "European Financial Literacy",
      description: "Navigate finance across European systems.",
    },
  },

  latam: {
    es: {
      heroTitle: "Educación Financiera LATAM",
      description: "Construye estabilidad financiera en América Latina.",
    },
  },

  africa: {
    en: {
      heroTitle: "African Financial Literacy",
      description: "Build resilient financial foundations.",
    },
  },

  asia: {
    en: {
      heroTitle: "Asian Financial Literacy",
      description: "Learn financial systems across Asia.",
    },
  },

  "asia-emerging": {
    en: {
      heroTitle: "Emerging Asia Financial Literacy",
      description:
        "Understand finance in fast-growing emerging Asian markets.",
    },
  },
};
