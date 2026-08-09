import { LANGUAGE_CATALOG } from "./international/languages";
import { translate } from "./international/i18n";

export const supportedLanguages = LANGUAGE_CATALOG.map((language) => language.code) as readonly string[];

export type Language = string;

export const isLanguage = (value: string): value is Language => {
  return supportedLanguages.includes(value);
};

export const REGION_LANGUAGES: Record<string, readonly string[]> = {
  global: supportedLanguages,
};

const LEGACY_KEY_MAP: Record<string, string> = {
  doctrine_title: "footer.identity",
  doctrine_body: "branding.longDescription",
};

export function t(lang: Language, key: string): string {
  return translate(lang, LEGACY_KEY_MAP[key] ?? key);
}
