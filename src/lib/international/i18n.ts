import enMessages from "../../locales/en.json";
import esMessages from "../../locales/es.json";
import frMessages from "../../locales/fr.json";
import ptMessages from "../../locales/pt.json";
import deMessages from "../../locales/de.json";
import itMessages from "../../locales/it.json";
import arMessages from "../../locales/ar.json";
import swMessages from "../../locales/sw.json";
import jaMessages from "../../locales/ja.json";
import koMessages from "../../locales/ko.json";
import zhHansMessages from "../../locales/zh-Hans.json";
import nlMessages from "../../locales/nl.json";
import hiMessages from "../../locales/hi.json";
import zhHantMessages from "../../locales/zh-Hant.json";
import htMessages from "../../locales/ht.json";
import plMessages from "../../locales/pl.json";
import ruMessages from "../../locales/ru.json";
import csMessages from "../../locales/cs.json";
import skMessages from "../../locales/sk.json";
import roMessages from "../../locales/ro.json";
import bgMessages from "../../locales/bg.json";
import ltMessages from "../../locales/lt.json";
import lvMessages from "../../locales/lv.json";
import etMessages from "../../locales/et.json";
import beMessages from "../../locales/be.json";
import faMessages from "../../locales/fa.json";
import psMessages from "../../locales/ps.json";
import haMessages from "../../locales/ha.json";
import igMessages from "../../locales/ig.json";
import lgMessages from "../../locales/lg.json";
import yueHantMessages from "../../locales/yue-Hant.json";
import { DEFAULT_LANGUAGE_CODE, normalizeLanguageCode } from "./languages";

type MessageCatalog = Record<string, string>;

const messageCatalogs: Record<string, MessageCatalog> = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  pt: ptMessages,
  de: deMessages,
  it: itMessages,
  ar: arMessages,
  sw: swMessages,
  ja: jaMessages,
  ko: koMessages,
  "zh-Hans": zhHansMessages,
  nl: nlMessages,
  hi: hiMessages,
  "zh-Hant": zhHantMessages,
  ht: htMessages,
  pl: plMessages,
  ru: ruMessages,
  cs: csMessages,
  sk: skMessages,
  ro: roMessages,
  bg: bgMessages,
  lt: ltMessages,
  lv: lvMessages,
  et: etMessages,
  be: beMessages,
  fa: faMessages,
  ps: psMessages,
  ha: haMessages,
  ig: igMessages,
  lg: lgMessages,
  "yue-Hant": yueHantMessages,
};

export function translate(
  languageCode: string,
  key: string,
  values?: Record<string, string | number>
) {
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
