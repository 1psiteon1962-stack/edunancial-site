// lib/language.ts

export const SUPPORTED_LANGS = [
  'en',
  'es',
  'fr',
  'de',
  'ar',
  'zh',
  'ja',
  'hi',
] as const;

export type Language = typeof SUPPORTED_LANGS[number];

export function isLanguage(value: string): value is Language {
  return SUPPORTED_LANGS.includes(value as Language);
}
