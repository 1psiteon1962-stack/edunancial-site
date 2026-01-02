import { Language, Region } from "./language";

export type RegionCurriculumContent = {
  heroTitle: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    amount: number;
  };
};

const baseContent = (
  title: string,
  description: string,
  currency: string
): Record<Language, RegionCurriculumContent> => ({
  en: {
    heroTitle: title,
    description,
    curriculum: ["Foundations", "Markets", "Risk", "Scaling"],
    pricing: { currency, amount: 0 },
  },
  es: {
    heroTitle: title,
    description,
    curriculum: ["Fundamentos", "Mercados", "Riesgo", "Escala"],
    pricing: { currency, amount: 0 },
  },
  fr: {
    heroTitle: title,
    description,
    curriculum: ["Fondations", "Marchés", "Risque", "Croissance"],
    pricing: { currency, amount: 0 },
  },
  de: {
    heroTitle: title,
    description,
    curriculum: ["Grundlagen", "Märkte", "Risiko", "Skalierung"],
    pricing: { currency, amount: 0 },
  },
  ar: {
    heroTitle: title,
    description,
    curriculum: ["الأساسيات", "الأسواق", "المخاطر", "التوسع"],
    pricing: { currency, amount: 0 },
  },
  zh: {
    heroTitle: title,
    description,
    curriculum: ["基础", "市场", "风险", "扩展"],
    pricing: { currency, amount: 0 },
  },
  ja: {
    heroTitle: title,
    description,
    curriculum: ["基礎", "市場", "リスク", "拡大"],
    pricing: { currency, amount: 0 },
  },
  hi: {
    heroTitle: title,
    description,
    curriculum: ["आधार", "बाज़ार", "जोखिम", "विस्तार"],
    pricing: { currency, amount: 0 },
  },
});

export const regionContent: Record<
  Region,
  Record<Language, RegionCurriculumContent>
> = {
  us: baseContent(
    "U.S. Financial Curriculum",
    "Build wealth using U.S. financial systems.",
    "USD"
  ),
  africa: baseContent(
    "Africa Financial Curriculum",
    "Build wealth across African markets.",
    "USD"
  ),
  europe: baseContent(
    "Europe Financial Curriculum",
    "Navigate European financial systems.",
    "EUR"
  ),
  asia: baseContent(
    "Asia Financial Curriculum",
    "Participate in Asian capital markets.",
    "USD"
  ),
  "asia-pacific": baseContent(
    "Asia-Pacific Financial Curriculum",
    "Asia-Pacific growth strategies.",
    "USD"
  ),
  "asia-emerging": baseContent(
    "Emerging Asia Financial Curriculum",
    "Emerging Asian economies & finance.",
    "USD"
  ),
  mena: baseContent(
    "MENA Financial Curriculum",
    "Middle East & North Africa finance systems.",
    "USD"
  ),
};
