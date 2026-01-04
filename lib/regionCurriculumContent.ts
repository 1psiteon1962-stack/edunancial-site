// lib/regionCurriculumContent.ts

import type { Language } from "@/lib/i18n";
import type { Region } from "@/lib/regions";

export type CurriculumTrack = {
  id: string;
  title: string;
  summary: string;
};

export type LocalizedRegionCurriculum = {
  title: string;
  description: string;
  tracks: CurriculumTrack[];
};

export type RegionCurriculumContent = Record<
  Language,
  LocalizedRegionCurriculum
>;

export const regionCurriculumContent: Record<
  Region,
  RegionCurriculumContent
> = {
  us: {
    en: {
      title: "United States Curriculum",
      description:
        "Foundational financial literacy, entrepreneurship, and capital structure for the U.S. market.",
      tracks: [
        {
          id: "us-foundations",
          title: "Financial Foundations",
          summary:
            "Income, budgeting, credit, and cashflow fundamentals tailored to U.S. systems.",
        },
      ],
    },
  },

  europe: {
    en: {
      title: "Europe Curriculum",
      description:
        "Cross-border compliance, capital movement, and business structuring in Europe.",
      tracks: [
        {
          id: "eu-structure",
          title: "European Business Structures",
          summary:
            "VAT, corporate entities, and regulatory realities across the EU.",
        },
      ],
    },
  },

  africa: {
    en: {
      title: "Africa Curriculum",
      description:
        "Entrepreneurship, infrastructure, and capital deployment across African markets.",
      tracks: [
        {
          id: "africa-growth",
          title: "Growth & Infrastructure",
          summary:
            "Building scalable ventures in emerging and frontier African economies.",
        },
      ],
    },
  },

  asia: {
    en: {
      title: "Asia Curriculum",
      description:
        "Manufacturing, supply chains, and regional market dynamics in Asia.",
      tracks: [
        {
          id: "asia-trade",
          title: "Trade & Manufacturing",
          summary:
            "Understanding production, logistics, and export-driven business models.",
        },
      ],
    },
  },

  "asia-pacific": {
    en: {
      title: "Asia-Pacific Curriculum",
      description:
        "Regional trade blocs, technology, and capital strategy in APAC.",
      tracks: [
        {
          id: "apac-strategy",
          title: "APAC Strategy",
          summary:
            "Scaling businesses across Asia-Pacific jurisdictions and cultures.",
        },
      ],
    },
  },

  mena: {
    en: {
      title: "MENA Curriculum",
      description:
        "Capital, compliance, and opportunity across the Middle East and North Africa.",
      tracks: [
        {
          id: "mena-capital",
          title: "Capital & Structure",
          summary:
            "Navigating sovereign wealth, regulation, and private capital in MENA.",
        },
      ],
    },
  },
};
