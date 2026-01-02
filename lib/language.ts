// lib/language.ts

/**
 * Canonical language definition for the entire platform.
 * ALL pages, regions, and components rely on this file.
 * Do not redefine languages anywhere else.
 */

export const LANGUAGES = [
  'en', // English
  'es', // Spanish
  'fr', // French
  'de', // German
  'ar', // Arabic
  'zh', // Chinese
  'ja', // Japanese
  'hi', // Hindi
] as const;

export type Language = (typeof LANGUAGES)[number];

/**
 * Runtime + TypeScript type guard.
 * This is REQUIRED for Next.js dynamic route params.
 */
export function isLanguage(value: string): value is Language {
  return (LANGUAGES as readonly string[]).includes(value);
}
