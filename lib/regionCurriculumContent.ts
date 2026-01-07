// lib/regionCurriculumContent.ts

import type { Language } from "@/lib/i18n";
import type { Region } from "@/lib/regions";

/* =========================
   CURRICULUM TYPES
========================= */

export type CurriculumTrack = {
  id: string;
  title: string;
  description: string;
};

export type RegionCurriculum = Record<
  Region,
  Partial<Record<Language, CurriculumTrack[]>>
>;

/* =========================
   CURRICULUM CONTENT
========================= */

export const regionCurriculumContent: RegionCurriculum = {
  us: {
    en: [
      {
        id: "credit",
        title: "Credit Systems",
        description: "How credit works in the U.S.",
      },
    ],
  },

  latam: {
    es: [
      {
        id: "negocios",
        title: "Estructura de Negocios",
        description: "Cómo formalizar empresas en LATAM.",
      },
    ],
    en: [
      {
        id: "business",
        title: "Business Structures",
        description: "How to formalize businesses in Latin America.",
      },
    ],
  },

  caribbean: {},
  europe: {},
  africa: {},
  mena: {},
  asia: {},
  "asia-pacific": {},
  "asia-emerging": {},
};
