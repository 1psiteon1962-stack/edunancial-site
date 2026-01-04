// lib/i18n.ts

import type { Region } from "./regions";

/**
 * Supported language codes
 * These are used across pages/[lang] and app/[region]/[lang]
 */
export const supportedLanguages = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
] as const;

/**
 * Language type derived from supportedLanguages
 */
export type Language = (typeof supportedLanguages)[number];

/**
 * Languages supported per region
 * REQUIRED by:
 * - app/eu/[lang]/page.tsx
 * - pages/[lang]/index.tsx
 */
export const REGION_LANGUAGES: Record<Region, Language[]> = {
  us: ["en", "es"],
  eu: ["en", "fr", "de"],
  latam: ["es", "pt"],
  africa: ["en", "fr"],
  global: ["en"],
};

/**
 * Default language per region
 * Used by content resolvers and curriculum logic
 */
export const DEFAULT_LANGUAGE_BY_REGION: Record<Region, Language> = {
  us: "en",
  eu: "en",
  latam: "es",
  africa: "en",
  global: "en",
};
