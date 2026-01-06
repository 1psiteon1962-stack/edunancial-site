// lib/i18n.ts
// Canonical i18n implementation for Edunancial
// This file MUST be the single source of truth for language support

export const supportedLanguages = ["en", "es", "fr"] as const;

export type Language = (typeof supportedLanguages)[number];

// Simple translation table (extend later, but keep structure)
const translations: Record<Language, Record<string, string>> = {
  en: {
    missionTitle: "Our Mission",
    missionBody:
      "Edunancial exists to provide structured, practical financial education across borders.",
    pillarAccess: "Access to financial systems",
    pillarStructure: "Business and legal structure",
    pillarProtection: "Risk, compliance, and protection",
    pillarScale: "Scalable global growth",
    missionFooter:
      "Education is the first step. Structure is the second. Execution is the third."
  },

  es: {
    missionTitle: "Nuestra Misión",
    missionBody:
      "Edunancial existe para proporcionar educación financiera estructurada y práctica a nivel global.",
    pillarAccess: "Acceso a sistemas financieros",
    pillarStructure: "Estructura empresarial y legal",
    pillarProtection: "Riesgo, cumplimiento y protección",
    pillarScale: "Crecimiento global escalable",
    missionFooter:
      "La educación es el primer paso. La estructura es el segundo. La ejecución es el tercero."
  },

  fr: {
    missionTitle: "Notre Mission",
    missionBody:
      "Edunancial a pour mission de fournir une éducation financière structurée et pratique à l’échelle mondiale.",
    pillarAccess: "Accès aux systèmes financiers",
    pillarStructure: "Structure juridique et commerciale",
    pillarProtection: "Risque, conformité et protection",
    pillarScale: "Croissance mondiale évolutive",
    missionFooter:
      "L’éducation est la première étape. La structure est la deuxième. L’exécution est la troisième."
  }
};

/**
 * Translation helper
 * IMPORTANT:
 * - Accepts ONLY a key
 * - Language resolution is handled elsewhere (router-level)
 */
export function t(key: string, lang: Language = "en"): string {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}
