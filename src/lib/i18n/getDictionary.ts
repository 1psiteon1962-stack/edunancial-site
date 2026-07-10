import {
  dictionaryLoaders,
  type TranslationDictionary,
} from "./registry";
import { DEFAULT_LANGUAGE, isLanguage } from "./languages";

export async function getDictionary(lang: string): Promise<TranslationDictionary> {
  const locale = isLanguage(lang) ? lang : DEFAULT_LANGUAGE;
  return dictionaryLoaders[locale]();
}
