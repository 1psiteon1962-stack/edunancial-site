// lib/i18n.ts

import type { Region } from "./regions";

/* -----------------------------
   Language Types
-------------------------------- */

export type Language =
  | "en"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "ar";

/* -----------------------------
   Default Language by Region
-------------------------------- */

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  latam: "es",
  europe: "en",
  africa: "en",
  asia: "en",
  "asia-pacific": "en",
  "asia-emerging": "en",
  mena: "ar",
};

/* -----------------------------
   Translation Dictionary
-------------------------------- */

const dictionary: Record<string, Partial<Record<Language, string>>> = {
  missionTitle: {
    en: "Financial Literacy for a Global Economy",
    es: "Educación Financiera para una Economía Global",
    fr: "Littératie financière pour une économie mondiale",
  },
  missionBody: {
    en: "Build real-world financial capability through structured tracks.",
    es: "Construya capacidad financiera real a través de rutas estructuradas.",
    fr: "Développez des compétences financières concrètes grâce à des parcours structurés.",
  },
};

/* -----------------------------
   Translation Helpers
-------------------------------- */

export function t(key: string, lang: Language = "en"): string {
  return dictionary[key]?.[lang] ?? dictionary[key]?.en ?? key;
}

export function isSupportedLang(lang: string): lang is Language {
  return ["en", "es", "fr", "de", "pt", "ar"].includes(lang);
}
