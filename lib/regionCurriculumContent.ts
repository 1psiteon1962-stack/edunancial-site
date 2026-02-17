import type { Language } from "@/lib/i18n";

/* =========================
   CURRICULUM TYPES
========================= */

export type CurriculumEntry = {
  title: string;
  description: string;
};

/**
 * Curriculum content keyed by REGION CODE STRING
 * (e.g. "us", "global")
 */
export type RegionCurriculumContent = Record<
  string,
  Record<Language, CurriculumEntry>
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
    },
    fr: {
      title: "Programme mondial",
      description: "Principes fondamentaux applicables dans le monde entier."
    },
    pt: {
      title: "Currículo Global",
      description: "Princípios fundamentais aplicáveis em todo o mundo."
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
    },
    fr: {
      title: "Programme américain",
      description: "Éducation alignée sur les systèmes des États-Unis."
    },
    pt: {
      title: "Currículo dos EUA",
      description: "Educação alinhada aos sistemas dos Estados Unidos."
    }
  }
};
