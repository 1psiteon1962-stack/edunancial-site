// lib/regions.ts

/* =========================
   Languages
========================= */

export const LANGUAGES = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "ar",
  "zh",
] as const;

export type Language = typeof LANGUAGES[number];

/* =========================
   Region Content
========================= */

export type RegionContent = {
  heroTitle: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    amount: number;
  };
};

/**
 * CRITICAL:
 * RegionLocales is derived from Language.
 * This makes it impossible for zh (or any future language)
 * to ever break the build again.
 */
export type RegionLocales = Record<Language, RegionContent>;
