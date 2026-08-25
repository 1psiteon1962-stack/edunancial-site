import enMessages from "../../locales/en.json";
import esMessages from "../../locales/es.json";
import frMessages from "../../locales/fr.json";
import frCaMessages from "../../locales/fr-CA.json";
import frFrMessages from "../../locales/fr-FR.json";
import ptMessages from "../../locales/pt.json";
import ptBrMessages from "../../locales/pt-BR.json";
import ptPtMessages from "../../locales/pt-PT.json";
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
  "en-GB": enMessages,
  es: esMessages,
  "es-ES": esMessages,
  fr: frMessages,
  "fr-CA": frCaMessages,
  "fr-FR": frFrMessages,
  pt: ptMessages,
  "pt-BR": { ...ptMessages, ...ptBrMessages },
  "pt-PT": { ...ptMessages, ...ptPtMessages },
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

const ENGLISH_PUBLIC_OVERRIDES: MessageCatalog = {
  "branding.identity": "Edunancial is a financial literacy and financial intelligence membership platform.",
  "branding.longDescription": "Edunancial is a membership platform designed to help people progress from financial literacy to financial intelligence through structured learning resources, interactive tools, practical exercises, and technology-supported methods.",
  "branding.methodsClarification": "Edunancial may use educational methods, including structured learning paths, Socratic questioning, artificial intelligence, repetition, flashcards, quizzes, and practical exercises, solely to help members progress from financial literacy to financial intelligence.",
  "footer.identity": "Edunancial is a financial literacy and financial intelligence membership platform.",
  "footer.subtitle": "From financial literacy to financial intelligence.",
  "footer.col.competency": "Intelligence",
  "faq.q1.answer": "Edunancial is a financial literacy and financial intelligence membership platform. It helps members strengthen practical financial judgment through learning resources, assessments, tools, and guided support.",
  "faq.q2.answer": "Red covers Real Estate, White covers Paper Assets, and Blue covers Business. Red, White, and Blue were only the beginning; they remain the foundation of a broader color-based learning architecture.",
  "home.story.p3": "Financial literacy gives people the foundation. Financial intelligence develops as they apply knowledge with disciplined action, measurable progress, and better decision-making.",
  "home.story.card1.body": "To help people progress from financial literacy to financial intelligence.",
  "home.story.card3.body": "Financial Literacy → Financial Intelligence → Disciplined Action → Measurable Progress → Wealth Building.",
  "home.hero.badge1": "First three Level 1 lessons free in every curriculum color",
  "home.hero.badge2": "Red, White, and Blue were only the beginning",
  "home.trial.label": "Free Level 1 Access",
  "home.trial.body": "Choose any curriculum color and access the first three lessons of Level 1 free. No paid membership is required for those introductory lessons.",
  "courses.title": "Build Financial Intelligence",
  "courses.intro": "Financial literacy provides the foundation. Edunancial is designed to help members build toward financial intelligence through learning, application, measurement, and better decision-making.",
  "pricingPage.intro": "Edunancial is a financial literacy and financial intelligence membership platform. Start with the first three Level 1 lessons in any curriculum color free, then choose the paid plan that fits the level of access you want.",
  "pricingPage.freePlan.name": "FREE LEVEL 1 ACCESS",
  "pricingPage.freePlan.description": "Create a free Edunancial account and access the first three lessons of Level 1 in every curriculum color at no cost. No paid membership is required for those introductory lessons.",
  "pricingPage.freePlan.ctaLabel": "Start Free Level 1 Lessons",
  "membership.title": "Become an Edunancial member and progress from financial literacy toward financial intelligence.",
  "membership.block2.body": "Measure your progress and track improvement across Edunancial learning paths.",
};

function normalizeEnglishPositioning(languageCode: string, key: string, template: string): string {
  const normalized = normalizeLanguageCode(languageCode);
  if (normalized !== "en" && normalized !== "en-US" && normalized !== "en-GB") return template;

  const override = ENGLISH_PUBLIC_OVERRIDES[key];
  if (override) return override;

  return template
    .replaceAll("Financial Competency", "Financial Intelligence")
    .replaceAll("financial competency", "financial intelligence");
}

export function translate(
  languageCode: string,
  key: string,
  values?: Record<string, string | number>
) {
  const localeChain = getLocaleFallbackChain(languageCode);
  const rawTemplate =
    localeChain
      .map((code) => messageCatalogs[code]?.[key])
      .find((entry): entry is string => typeof entry === "string")
    ?? key;
  const template = normalizeEnglishPositioning(languageCode, key, rawTemplate);

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
