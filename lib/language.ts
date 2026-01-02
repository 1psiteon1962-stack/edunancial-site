export const SUPPORTED_LANGUAGES = [
  'en',
  'es',
  'fr',
  'de',
  'ar',
  'zh',
  'hi',
  'ja',
  'pt',
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const isLanguage = (v: string): v is Language =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(v);
