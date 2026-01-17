// lib/i18n.ts
// Central i18n + language contract for the entire app

/* -------------------------
   Supported Languages
-------------------------- */

export const supportedLanguages = [
  "en", // English (US default)
  "es", // Spanish (US secondary)
  "ar", // Arabic (MENA)
] as const;

export type Language = (typeof supportedLanguages)[number];

/* -------------------------
   Defaults
-------------------------- */

export const DEFAULT_LANGUAGE: Language = "en";

/* -------------------------
   Runtime Guards
-------------------------- */

export const isLanguage = (value: string): value is Language => {
  return supportedLanguages.includes(value as Language);
};

/* -------------------------
   Translations
   (simple + safe, no external deps)
-------------------------- */

type Dictionary = Record<string, Record<Language, string>>;

const DICTIONARY: Dictionary = {
  "site.title": {
    en: "Edunancial",
    es: "Edunancial",
    ar: "إيدونانشال",
  },

  "site.tagline": {
    en: "Financial literacy for real-world wealth",
    es: "Educación financiera para riqueza real",
    ar: "محو الأمية المالية لبناء الثروة",
  },

  "nav.real_estate": {
    en: "Real Estate",
    es: "Bienes Raíces",
    ar: "العقارات",
  },

  "nav.paper_assets": {
    en: "Paper Assets",
    es: "Activos Financieros",
    ar: "الأصول الورقية",
  },

  "nav.business": {
    en: "Business",
    es: "Negocios",
    ar: "الأعمال",
  },

  "cta.start": {
    en: "Get Started",
    es: "Comenzar",
    ar: "ابدأ",
  },
};

/* -------------------------
   Translation Helper
-------------------------- */

export const t = (
  key: keyof typeof DICTIONARY,
  language: Language = DEFAULT_LANGUAGE
): string => {
  return (
    DICTIONARY[key]?.[language] ??
    DICTIONARY[key]?.[DEFAULT_LANGUAGE] ??
    key
  );
};
