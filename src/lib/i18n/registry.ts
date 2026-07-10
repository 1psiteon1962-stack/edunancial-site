import { DEFAULT_LANGUAGE, isLanguage, type SupportedLanguage } from "./languages";
import ar from "./translations/ar";
import de from "./translations/de";
import en from "./translations/en";
import es from "./translations/es";
import fr from "./translations/fr";
import it from "./translations/it";
import ja from "./translations/ja";
import ko from "./translations/ko";
import nl from "./translations/nl";
import pt from "./translations/pt";
import tl from "./translations/tl";

export type TranslationDictionary = {
  [key: string]: string | TranslationDictionary;
};

export const dictionaries: Record<SupportedLanguage, TranslationDictionary> = {
  en,
  es,
  fr,
  de,
  pt,
  it,
  nl,
  ko,
  ja,
  tl,
  ar,
};

export const dictionaryLoaders: Record<SupportedLanguage, () => Promise<TranslationDictionary>> = {
  en: async () => en,
  es: async () => es,
  fr: async () => fr,
  de: async () => de,
  pt: async () => pt,
  it: async () => it,
  nl: async () => nl,
  ko: async () => ko,
  ja: async () => ja,
  tl: async () => tl,
  ar: async () => ar,
};

function resolveNestedValue(source: unknown, key: string): string | undefined {
  if (!key) {
    return undefined;
  }

  const value = key.split(".").reduce<unknown>((current, segment) => {
    if (typeof current === "object" && current !== null && segment in current) {
      return (current as Record<string, unknown>)[segment];
    }

    return undefined;
  }, source);

  return typeof value === "string" ? value : undefined;
}

export function getDictionarySync(locale: string): TranslationDictionary {
  if (isLanguage(locale)) {
    return dictionaries[locale];
  }

  return dictionaries[DEFAULT_LANGUAGE];
}

export function interpolate(
  template: string,
  params?: Record<string, string>
): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, token: string) => {
    return params[token] ?? `{{${token}}}`;
  });
}

export function translateStatic(
  locale: string,
  key: string,
  params?: Record<string, string>
): string {
  const dictionary = getDictionarySync(locale);
  const fallbackDictionary = getDictionarySync(DEFAULT_LANGUAGE);
  const value =
    resolveNestedValue(dictionary, key) ??
    resolveNestedValue(fallbackDictionary, key) ??
    key;

  return interpolate(value, params);
}
