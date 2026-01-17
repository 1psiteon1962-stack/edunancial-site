// lib/i18n.ts

export const supportedLanguages = [
  "en", // English (default – United States)
  "es", // Spanish (United States secondary)
  "ar", // Arabic (MENA)
] as const;

export type Language = (typeof supportedLanguages)[number];

/**
 * Runtime type guard to validate language route params
 */
export const isLanguage = (value: string): value is Language => {
  return supportedLanguages.includes(value as Language);
};
