export const languages = [
  "en",
  "es",
  "zh",
  "ko",
  "ja",
  "fil",
  "hi",
  "ms",
  "ar",
  "pt",
  "fr",
  "de",
  "it",
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
  { code: "zh", label: "Chinese", nativeLabel: "中文" },
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "fil", label: "Filipino", nativeLabel: "Filipino" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "ms", label: "Malay", nativeLabel: "Bahasa Melayu" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "fr", label: "French", nativeLabel: "Français" },
  { code: "de", label: "German", nativeLabel: "Deutsch" },
  { code: "it", label: "Italian", nativeLabel: "Italiano" },
];

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}
