import {
  LANGUAGE_CATALOG,
  type LanguageDefinition,
} from "@/lib/international/languages";

export const supportedLanguages: LanguageDefinition[] = [...LANGUAGE_CATALOG];

export const languages = supportedLanguages.map((language) => language.code) as readonly string[];

export type SupportedLanguage = (typeof languages)[number];

export type Language = SupportedLanguage;

export type SupportedLanguageConfig = LanguageDefinition;

export function isLanguage(value: string): value is Language {
  return languages.includes(value);
}
