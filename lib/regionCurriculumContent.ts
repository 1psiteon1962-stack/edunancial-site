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
      description: "Understand money, credit, and financial systems in the U.S.",
    },
  },

  europe: {
    en: {
      heroTitle: "European Financial Literacy",
      description: "Navigate financial systems across Europe.",
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
      description: "Build strong financial foundations across Africa.",
    },
  },

  asia: {
    en: {
      heroTitle: "Asian Financial Literacy",
      description: "Understand financial systems across Asia.",
    },
  },

  "asia-emerging": {
    en: {
      heroTitle: "Emerging Asia Financial Literacy",
      description: "Financial literacy for fast-growing Asian markets.",
    },
  },

  "asia-pacific": {
    en: {
      heroTitle: "Asia-Pacific Financial Literacy",
      description: "Navigate finance across the Asia-Pacific region.",
    },
  },

  mena: {
    en: {
      heroTitle: "MENA Financial Literacy",
      description:
        "Understand finance, business, and economic systems across the Middle East and North Africa.",
    },
    ar: {
      heroTitle: "الثقافة المالية في الشرق الأوسط وشمال أفريقيا",
      description:
        "فهم الأنظمة المالية والتجارية في منطقة الشرق الأوسط وشمال أفريقيا.",
    },
  },
};
