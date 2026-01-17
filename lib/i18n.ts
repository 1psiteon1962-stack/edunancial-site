// lib/i18n.ts
// Canonical i18n + region contract for the entire Edunancial platform
// Financial literacy platform (non-regulated, non-credentialed)

/* ======================================================
   REGIONS
   ====================================================== */

export const supportedRegions = [
  "us",
  "mena",
  "latam",
  "eu",
] as const;

export type Region = (typeof supportedRegions)[number];

/* ======================================================
   LANGUAGES
   ====================================================== */

export const supportedLanguages = [
  "en", // English
  "es", // Spanish
  "ar", // Arabic
] as const;

export type Language = (typeof supportedLanguages)[number];

/* ======================================================
   REGION → LANGUAGE MATRIX
   (USED BY static params + routing)
   ====================================================== */

export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  us: ["en", "es"],
  mena: ["ar", "en"],
  latam: ["es", "en"],
  eu: ["en"],
};

/* ======================================================
   DEFAULTS
   ====================================================== */

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  mena: "ar",
  latam: "es",
  eu: "en",
};

export const DEFAULT_LANGUAGE: Language = "en";

/* ======================================================
   TYPE GUARDS
   ====================================================== */

export const isLanguage = (value: string): value is Language => {
  return supportedLanguages.includes(value as Language);
};

export const isRegion = (value: string): value is Region => {
  return supportedRegions.includes(value as Region);
};

/* ======================================================
   TRANSLATION DICTIONARY
   (simple, explicit, legally safe)
   ====================================================== */

type Dictionary = Record<string, Partial<Record<Language, string>>>;

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

/* ======================================================
   TRANSLATION HELPER
   ====================================================== */

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
