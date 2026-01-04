// lib/i18n.ts

import type { Region } from "./regions";

/* -----------------------------
   Languages
-------------------------------- */

export const supportedLanguages = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
] as const;

export type Language = (typeof supportedLanguages)[number];

/* -----------------------------
   Regions → Languages
-------------------------------- */

export const REGION_LANGUAGES: Record<Region, Language[]> = {
  us: ["en", "es"],
  eu: ["en", "fr", "de"],
  latam: ["es", "pt"],
  africa: ["en", "fr"],
  global: ["en"],
};

export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  eu: "en",
  latam: "es",
  africa: "en",
  global: "en",
};

/* -----------------------------
   Minimal Translation Store
   (safe for static builds)
-------------------------------- */

type TranslationDict = Record<string, string>;

const TRANSLATIONS: Record<Language, TranslationDict> = {
  en: {},
  es: {},
  fr: {},
  de: {},
  pt: {},
};

/* -----------------------------
   Translation Helper
-------------------------------- */

/**
 * Safe translation helper.
 * - Never throws
 * - Never breaks static builds
 * - Falls back to key if missing
 */
export function t(
  key: string,
  lang: Language = "en"
): string {
  return TRANSLATIONS[lang]?.[key] ?? key;
}
