// CENTRAL LANGUAGE CONFIG — FULLY COMPATIBLE WITH ALL CURRENT IMPORTS

export const languageLabels: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

// REQUIRED EXPORTS (fixes ALL current errors)
export const supportedLanguages: string[] = Object.keys(languageLabels);

export type Language = keyof typeof languageLabels;

// ✅ THIS IS THE MISSING PIECE CAUSING YOUR CURRENT FAILURE
export function isLanguage(value: string): value is Language {
  return value in languageLabels;
}
