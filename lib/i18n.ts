// lib/i18n.ts

import type { RegionKey } from "./regions";

export const supportedLanguages = ["en", "es", "fr", "de", "ar"] as const;
export type Language = (typeof supportedLanguages)[number];

export const DEFAULT_LANGUAGE: Language = "en";
export const DEFAULT_LANG: Language = DEFAULT_LANGUAGE;

export function isSupportedLang(value: string): value is Language {
  return (supportedLanguages as readonly string[]).includes(value);
}

/**
 * Minimal translation helper
 * (placeholder until full i18n system is added)
 */
export function t(text: string): string {
  return text;
}

export const REGION_LANGUAGES: Record<RegionKey, Language[]> = {
  us: ["en", "es"],
  europe: ["en", "fr", "de"],
  latam: ["es"],
  africa: ["en", "fr", "ar"],
  asia: ["en"],
  "asia-emerging": ["en"],
  "asia-pacific": ["en"],
};
