export const DEFAULT_LANGUAGE = "en";
export const LOCALE_STORAGE_KEY = "edunancial_locale";

export const languages = [
  "en",
  "es",
  "fr",
  "de",
  "pt",
  "it",
  "nl",
  "ko",
  "ja",
  "tl",
  "ar",
] as const;

export type SupportedLanguage = (typeof languages)[number];
export type Language = SupportedLanguage;

export type SupportedLanguageConfig = {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
};

export const supportedLanguages: SupportedLanguageConfig[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "es", label: "Spanish", nativeLabel: "Español" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
  { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
];

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}

export function getLanguageConfig(locale: string): SupportedLanguageConfig {
  return (
    supportedLanguages.find((language) => language.code === locale) ??
    supportedLanguages[0]
  );
}
