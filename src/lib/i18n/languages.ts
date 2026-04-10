export const languageLabels: Record<string, string> = {
  en: "English",
  es: "Español",
  fr: "Français",
};

// ✅ REQUIRED EXPORT — fixes your Netlify error
export const supportedLanguages: string[] = Object.keys(languageLabels);

// Optional (safe typing if used elsewhere)
export type Language = keyof typeof languageLabels;
