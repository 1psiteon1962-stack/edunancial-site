import enMessages from "../../locales/en.json";
import esMessages from "../../locales/es.json";
import frMessages from "../../locales/fr.json";
import ptMessages from "../../locales/pt.json";
import arMessages from "../../locales/ar.json";
import swMessages from "../../locales/sw.json";
import jaMessages from "../../locales/ja.json";
import koMessages from "../../locales/ko.json";
import zhHansMessages from "../../locales/zh-Hans.json";
import hiMessages from "../../locales/hi.json";
import zhHantMessages from "../../locales/zh-Hant.json";
import { DEFAULT_LANGUAGE_CODE, normalizeLanguageCode } from "./languages";

type MessageCatalog = Record<string, string>;

const messageCatalogs: Record<string, MessageCatalog> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  pt: ptMessages,
  ar: arMessages,
  sw: swMessages,
  ja: jaMessages,
  ko: koMessages,
  "zh-Hans": zhHansMessages,
  hi: hiMessages,
  "zh-Hant": zhHantMessages,
};

export function translate(languageCode: string, key: string, values?: Record<string, string | number>) {
  const normalizedLanguage = normalizeLanguageCode(languageCode);
  const catalog = messageCatalogs[normalizedLanguage] ?? messageCatalogs[DEFAULT_LANGUAGE_CODE];
  const fallbackCatalog = messageCatalogs[DEFAULT_LANGUAGE_CODE];

  const template = catalog?.[key] ?? fallbackCatalog?.[key] ?? key;

  if (!values) {
    return template;
  }

  return Object.entries(values).reduce((message, [token, value]) => {
    return message.replaceAll(`{{${token}}}`, String(value));
  }, template);
}

export function translatePlural(
  languageCode: string,
  keyBase: string,
  count: number,
  values?: Record<string, string | number>
) {
  const normalizedLanguage = normalizeLanguageCode(languageCode);
  const pluralCategory = new Intl.PluralRules(normalizedLanguage).select(count);
  const categoryKey = `${keyBase}_${pluralCategory}`;
  const fallbackCategoryKey = `${keyBase}_other`;

  return translate(
    normalizedLanguage,
    categoryKey,
    values ?? { count }
  ) !== categoryKey
    ? translate(normalizedLanguage, categoryKey, values ?? { count })
    : translate(normalizedLanguage, fallbackCategoryKey, values ?? { count });
}
