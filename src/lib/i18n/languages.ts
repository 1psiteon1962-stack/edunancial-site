export const languages = [
  "en",
  "es",
  "ko",
  "ja",
  "zh-Hans",
  "zh-Hant",
  "hi",
  "tl",
  "ar",
  "pt",
  "fr",
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
  { code: "ko", label: "Korean", nativeLabel: "한국어" },
  { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  { code: "zh-Hans", label: "Chinese (Simplified)", nativeLabel: "中文 (简体)" },
  { code: "zh-Hant", label: "Chinese (Traditional)", nativeLabel: "中文 (繁體)" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "tl", label: "Tagalog", nativeLabel: "Tagalog" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  { code: "fr", label: "French", nativeLabel: "Français" },
];

export function isLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}
