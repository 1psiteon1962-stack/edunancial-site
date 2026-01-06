// lib/i18n.ts

/* =========================
   LANGUAGES
========================= */

export const SUPPORTED_LANGUAGES = ["en", "es", "fr", "ar", "pt"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/* =========================
   REGIONS
========================= */

export const REGIONS = [
  "us",
  "latam",
  "caribbean",
  "europe",
  "africa",
  "mena",
  "asia",
  "asia-pacific",
  "asia-emerging",
] as const;

export type Region = (typeof REGIONS)[number];

/* =========================
   REGION → LANGUAGES
========================= */

export const REGION_LANGUAGES: Record<Region, readonly Language[]> = {
  us: ["en", "es"],
  latam: ["es"],
  caribbean: ["en", "es", "fr"],
  europe: ["en", "fr"],
  africa: ["en", "fr", "ar"],
  mena: ["ar", "en", "fr"],
  asia: ["en"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"],
} as const;

/* =========================
   DEFAULT LANGUAGE
========================= */

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  latam: "es",
  caribbean: "en",
  europe: "en",
  africa: "en",
  mena: "ar",
  asia: "en",
  "asia-pacific": "en",
  "asia-emerging": "en",
};

/* =========================
   TYPE GUARDS
========================= */

export function isLanguage(
  value: string,
  region: Region
): value is Language {
  return REGION_LANGUAGES[region].includes(value as Language);
}

/* =========================
   TRANSLATION HELPER
   (SYNC, BUILD-SAFE)
========================= */

const COPY: Record<Language, Record<string, string>> = {
  en: {
    "doctrine.title": "The Edunancial Doctrine",
    "doctrine.subtitle": "Structure before scale. Law before growth.",
  },
  es: {
    "doctrine.title": "La Doctrina Edunancial",
    "doctrine.subtitle": "Estructura antes de escalar. Derecho antes de crecer.",
  },
  fr: {
    "doctrine.title": "La Doctrine Edunancial",
    "doctrine.subtitle": "La structure avant l’expansion. Le droit avant la croissance.",
  },
  ar: {
    "doctrine.title": "عقيدة إدونانشال",
    "doctrine.subtitle": "البنية قبل التوسع. القانون قبل النمو.",
  },
  pt: {
    "doctrine.title": "A Doutrina Edunancial",
    "doctrine.subtitle": "Estrutura antes de escalar. Direito antes de crescer.",
  },
};

/**
 * Synchronous translation helper
 * Netlify-safe, React-safe, build-safe
 */
export function t(lang: Language, key: string): string {
  return COPY[lang]?.[key] ?? key;
}
