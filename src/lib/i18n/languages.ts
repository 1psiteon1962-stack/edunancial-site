export const languageLabels: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

export const supportedLanguages: string[] = Object.keys(languageLabels);

export type Language = keyof typeof languageLabels;
