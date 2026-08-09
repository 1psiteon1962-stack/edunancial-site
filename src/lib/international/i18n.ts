import enMessages from "../../locales/en.json";
import esMessages from "../../locales/es.json";
import frMessages from "../../locales/fr.json";
import frCaMessages from "../../locales/fr-CA.json";
import frFrMessages from "../../locales/fr-FR.json";
import ptMessages from "../../locales/pt.json";
import deMessages from "../../locales/de.json";
import itMessages from "../../locales/it.json";
import nlMessages from "../../locales/nl.json";
import htMessages from "../../locales/ht.json";
import papMessages from "../../locales/pap.json";
import plMessages from "../../locales/pl.json";
import arMessages from "../../locales/ar.json";
import heMessages from "../../locales/he.json";
import hiMessages from "../../locales/hi.json";
import thMessages from "../../locales/th.json";
import viMessages from "../../locales/vi.json";
import msMessages from "../../locales/ms.json";
import idMessages from "../../locales/id.json";
import filMessages from "../../locales/fil.json";
import taMessages from "../../locales/ta.json";
import bnMessages from "../../locales/bn.json";
import urMessages from "../../locales/ur.json";
import zhHansMessages from "../../locales/zh-Hans.json";
import zhHantMessages from "../../locales/zh-Hant.json";
import jaMessages from "../../locales/ja.json";
import koMessages from "../../locales/ko.json";
import csMessages from "../../locales/cs.json";
import skMessages from "../../locales/sk.json";
import roMessages from "../../locales/ro.json";
import bgMessages from "../../locales/bg.json";
import ltMessages from "../../locales/lt.json";
import lvMessages from "../../locales/lv.json";
import etMessages from "../../locales/et.json";
import beMessages from "../../locales/be.json";
import ruMessages from "../../locales/ru.json";
import faMessages from "../../locales/fa.json";
import prsMessages from "../../locales/prs.json";
import psMessages from "../../locales/ps.json";
import swMessages from "../../locales/sw.json";
import lgMessages from "../../locales/lg.json";
import yoMessages from "../../locales/yo.json";
import igMessages from "../../locales/ig.json";
import haMessages from "../../locales/ha.json";
import zuMessages from "../../locales/zu.json";
import amMessages from "../../locales/am.json";
import {
  getLocaleFallbackChain,
  normalizeLanguageCode,
} from "./languages";

type MessageCatalog = Record<string, string>;

const messageCatalogs: Record<string, MessageCatalog> = {
  en: enMessages,
  "en-US": enMessages,
  es: esMessages,
  fr: frMessages,
  "fr-CA": frCaMessages,
  "fr-FR": frFrMessages,
  pt: ptMessages,
  de: deMessages,
  it: itMessages,
  nl: nlMessages,
  ht: htMessages,
  pap: papMessages,
  pl: plMessages,
  ar: arMessages,
  he: heMessages,
  hi: hiMessages,
  th: thMessages,
  vi: viMessages,
  ms: msMessages,
  id: idMessages,
  fil: filMessages,
  ta: taMessages,
  bn: bnMessages,
  ur: urMessages,
  "zh-Hans": zhHansMessages,
  "zh-Hant": zhHantMessages,
  ja: jaMessages,
  ko: koMessages,
  cs: csMessages,
  sk: skMessages,
  ro: roMessages,
  bg: bgMessages,
  lt: ltMessages,
  lv: lvMessages,
  et: etMessages,
  be: beMessages,
  ru: ruMessages,
  fa: faMessages,
  prs: prsMessages,
  ps: psMessages,
  sw: swMessages,
  lg: lgMessages,
  yo: yoMessages,
  ig: igMessages,
  ha: haMessages,
  zu: zuMessages,
  am: amMessages,
};

export function translate(
  languageCode: string,
  key: string,
  values?: Record<string, string | number>
) {
  const localeChain = getLocaleFallbackChain(languageCode);
  const template =
    localeChain
      .map((code) => messageCatalogs[code]?.[key])
      .find((entry): entry is string => typeof entry === "string")
    ?? key;

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
