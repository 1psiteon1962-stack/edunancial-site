// lib/i18n.ts
// SINGLE SOURCE OF TRUTH for language + region validation
// This file MUST satisfy ALL imports across the app

/* ----------------------------------
   GLOBAL LANGUAGE SUPPORT
----------------------------------- */

export const supportedLanguages = ["en", "es", "fr"] as const;
export type Language = (typeof supportedLanguages)[number];

/* ----------------------------------
   REGION → LANGUAGE MAP
----------------------------------- */

export const REGION_LANGUAGES = {
  us: ["en", "es"],
  europe: ["en", "fr"],
  africa: ["en", "fr"],
  mena: ["en", "fr"],
  latam: ["es"],
  caribbean: ["en", "es", "fr"],
  asia: ["en"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"]
} as const;

export type Region = keyof typeof REGION_LANGUAGES;

/* ----------------------------------
   TYPE GUARDS
----------------------------------- */

export function isLanguage(
  lang: string,
  region: Region
): lang is Language {
  return REGION_LANGUAGES[region].includes(lang as Language);
}

/* ----------------------------------
   TRANSLATIONS
----------------------------------- */

const translations: Record<Language, Record<string, string>> = {
  en: {
    missionTitle: "Our Mission",
    missionBody:
      "Edunancial provides structured, practical financial education designed for global realities.",
    pillarAccess: "Access to financial systems",
    pillarStructure: "Business and legal structure",
    pillarProtection: "Risk, compliance, and protection",
    pillarScale: "Scalable global growth",
    missionFooter:
      "Education first. Structure second. Execution third."
  },

  es: {
    missionTitle: "Nuestra Misión",
    missionBody:
      "Edunancial ofrece educación financiera estructurada y práctica para realidades globales.",
    pillarAccess: "Acceso a sistemas financieros",
    pillarStructure: "Estructura empresarial y legal",
    pillarProtection: "Riesgo, cumplimiento y protección",
    pillarScale: "Crecimiento global escalable",
    missionFooter:
      "Educación primero. Estructura segundo. Ejecución tercero."
  },

  fr: {
    missionTitle: "Notre Mission",
    missionBody:
      "Edunancial fournit une éducation financière structurée et pratique adaptée aux réalités mondiales.",
    pillarAccess: "Accès aux systèmes financiers",
    pillarStructure: "Structure juridique et commerciale",
    pillarProtection: "Risque, conformité et protection",
    pillarScale: "Croissance mondiale évolutive",
    missionFooter:
      "Éducation d’abord. Structure ensuite. Exécution enfin."
  }
};

/* ----------------------------------
   TRANSLATION HELPER
----------------------------------- */

export function t(
  key: string,
  lang: Language = "en"
): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
