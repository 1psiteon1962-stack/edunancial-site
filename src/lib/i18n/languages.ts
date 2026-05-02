// src/lib/i18n/languages.ts

export type SupportedLanguage = "en" | "es";

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
];
