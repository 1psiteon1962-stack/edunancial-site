// lib/i18n.ts

/* =========================
   LANGUAGES
========================= */

export const supportedLanguages = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ar",
] as const;

export type Language = (typeof supportedLanguages)[number];

/* =========================
   REGIONS
========================= */

export type Region =
  | "us"
  | "eu"
  | "latam"
  | "africa"
  | "mena"
  | "asia"
  | "asia-pacific"
  | "global";

/* =========================
   REGION → LANGUAGES
========================= */

export const REGION_LANGUAGES: Record<Region, Language[]> = {
  us: ["en", "es"],
  eu: ["en", "fr", "de"],
  latam: ["es", "pt"],
  africa: ["en", "fr", "ar"],
  mena: ["ar", "en"],
  asia: ["en"],
  "asia-pacific": ["en"],
  global: ["en"],
};

/* =========================
   DEFAULT LANGUAGE BY REGION
========================= */

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  eu: "en",
  latam: "es",
  africa: "en",
  mena: "ar",
  asia: "en",
  "asia-pacific": "en",
  global: "en",
};

/* =========================
   TRANSLATION HELPER
========================= */

const DICTIONARY: Record<Language, Record<string, string>> = {
  en: {
    missionTitle: "Our Mission",
    missionBody: "Building financial literacy worldwide.",
  },
  es: {
    missionTitle: "Nuestra misión",
    missionBody: "Construyendo educación financiera global.",
  },
  fr: {
    missionTitle: "Notre mission",
    missionBody: "Développer l’éducation financière mondiale.",
  },
  de: {
    missionTitle: "Unsere Mission",
    missionBody: "Globale Finanzbildung aufbauen.",
  },
  pt: {
    missionTitle: "Nossa missão",
    missionBody: "Construindo educação financeira global.",
  },
  ar: {
    missionTitle: "مهمتنا",
    missionBody: "بناء الثقافة المالية عالميًا.",
  },
};

export function t(
  key: string,
  lang: Language = "en"
): string {
  return DICTIONARY[lang]?.[key] ?? key;
}
