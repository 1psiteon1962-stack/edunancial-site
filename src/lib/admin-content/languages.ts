export const ADMIN_CONTENT_LANGUAGES = [
  "en",
  "en-US",
  "en-GB",
  "es",
  "es-Caribbean",
  "es-ES",
  "fr",
  "fr-CA",
  "fr-FR",
  "pt",
  "pt-BR",
  "pt-PT",
  "de",
  "it",
  "nl",
] as const;

export type AdminContentLanguage = (typeof ADMIN_CONTENT_LANGUAGES)[number];

export const ADMIN_CONTENT_LANGUAGE_LABELS: Record<AdminContentLanguage, string> = {
  en: "English",
  "en-US": "English (United States)",
  "en-GB": "English (United Kingdom)",
  es: "Spanish",
  "es-Caribbean": "Spanish (Caribbean)",
  "es-ES": "Spanish (Spain)",
  fr: "French",
  "fr-CA": "French (Canada)",
  "fr-FR": "French (France)",
  pt: "Portuguese",
  "pt-BR": "Portuguese (Brazil)",
  "pt-PT": "Portuguese (Portugal)",
  de: "German",
  it: "Italian",
  nl: "Dutch",
};

export function canonicalAdminContentLanguage(language: string): AdminContentLanguage {
  if (language === "en") return "en-US";
  if (language === "fr") return "fr-FR";
  if (language === "pt") return "pt-BR";
  if ((ADMIN_CONTENT_LANGUAGES as readonly string[]).includes(language)) {
    return language as AdminContentLanguage;
  }
  return "en-US";
}
