import type { Language } from "@/lib/i18n";

/* =========================
   CURRICULUM TYPES
========================= */

export type CurriculumEntry = {
  title: string;
  description: string;
};

/**
 * Curriculum content keyed by REGION CODE (string),
 * with OPTIONAL language coverage per region.
 */
export type RegionCurriculumContent = Record<
  string,
  Partial<Record<Language, CurriculumEntry>>
>;

/* =========================
   CURRICULUM CONTENT
========================= */

export const regionCurriculumContent: RegionCurriculumContent = {
  global: {
    en: {
      title: "Global Curriculum",
      description: "Foundational principles applicable worldwide."
    },
    es: {
      title: "Currículo Global",
      description: "Principios fundamentales aplicables en todo el mundo."
    }
  },

  us: {
    en: {
      title: "U.S. Curriculum",
      description: "Education aligned with United States systems."
    },
    es: {
      title: "Currículo de EE. UU.",
      description: "Educación alineada con los sistemas de los Estados Unidos."
    }
  }
};
