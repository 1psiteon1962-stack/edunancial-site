// src/lib/i18n/languages.ts

export type SupportedLanguage =
  | "en"
  | "es"
  | "ko"
  | "ja"
  | "tl"
  | "ar"
  | "pt"
  | "fr";

export type SupportedLanguageConfig = {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
};

export const supportedLanguages: SupportedLanguageConfig[] = [
  {
    code: "en",
    label: "English",
    nativeLabel: "English",
  },
  {
    code: "es",
    label: "Spanish",
    nativeLabel: "Español",
  },
  {
    code: "ko",
    label: "Korean",
    nativeLabel: "한국어",
  },
  {
    code: "ja",
    label: "Japanese",
    nativeLabel: "日本語",
  },
  {
    code: "tl",
    label: "Tagalog",
    nativeLabel: "Tagalog",
  },
  {
    code: "ar",
    label: "Arabic",
    nativeLabel: "العربية",
  },
  {
    code: "pt",
    label: "Portuguese",
    nativeLabel: "Português",
  },
  {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
  },
];
