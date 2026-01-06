// lib/i18n.ts

export const SUPPORTED_LANGUAGES = [
  "en",
  "es",
  "fr",
  "pt",
  "ar"
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const REGIONS = [
  "us",
  "latam",
  "caribbean",
  "europe",
  "africa",
  "mena",
  "asia",
  "asia-pacific",
  "asia-emerging"
] as const;

export type Region = (typeof REGIONS)[number];

export const REGION_LANGUAGES: Record<Region, Language[]> = {
  us: ["en", "es"],
  latam: ["es", "pt"],
  caribbean: ["es", "fr", "en", "nl"],
  europe: ["en", "fr"],
  africa: ["en", "fr"],
  mena: ["ar", "en", "fr"],
  asia: ["en"],
  "asia-pacific": ["en"],
  "asia-emerging": ["en"]
};

export function isLanguage(
  value: string,
  region: Region
): value is Language {
  return REGION_LANGUAGES[region].includes(value as Language);
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    missionTitle: "Financial Education for Global Entrepreneurs",
    missionBody: "Build wealth using structured financial systems."
  },
  es: {
    missionTitle: "Educación financiera para emprendedores globales",
    missionBody: "Construye riqueza usando sistemas financieros estructurados."
  },
  fr: {
    missionTitle: "Éducation financière pour entrepreneurs mondiaux",
    missionBody: "Construisez la richesse grâce à des systèmes financiers structurés."
  },
  pt: {
    missionTitle: "Educação financeira para empreendedores globais",
    missionBody: "Construa riqueza usando sistemas financeiros estruturados."
  },
  ar: {
    missionTitle: "التعليم المالي لرواد الأعمال العالميين",
    missionBody: "بناء الثروة باستخدام أنظمة مالية منظمة."
  }
};

export function t(lang: Language, key: string): string {
  return TRANSLATIONS[lang]?.[key] ?? key;
}
