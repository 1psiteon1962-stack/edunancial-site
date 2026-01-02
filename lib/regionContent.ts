// lib/regionContent.ts
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
    curriculum: [],
    pricing: { currency, amount: 0 },
  },
  es: {
    heroTitle: title,
    description,
    curriculum: [],
    pricing: { currency, amount: 0 },
  },
  fr: {
    heroTitle: title,
    description,
    curriculum: [],
    pricing: { currency, amount: 0 },
  },
  de: {
    heroTitle: title,
    description,
    curriculum: [],
    pricing: { currency, amount: 0 },
  },
  ar: {
    heroTitle: title,
    description,
    curriculum: [],
    pricing: { currency, amount: 0 },
  },
  zh: {
    heroTitle: title,
    description,
    curriculum: [],
    pricing: { currency, amount: 0 },
  },
  ja: {
    heroTitle: title,
    description,
    curriculum: [],
    pricing: { currency, amount: 0 },
  },
  hi: {
    heroTitle: title,
    description,
    curriculum: [],
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
  europe: baseContent(
    "European Financial Curriculum",
    "Navigate European financial systems.",
    "EUR"
  ),
  africa: baseContent(
    "African Financial Curriculum",
    "Build wealth across African markets.",
    "USD"
  ),
  asia: baseContent(
    "Asian Financial Curriculum",
    "Understand Asian economic systems.",
    "USD"
  ),
  "asia-pacific": baseContent(
    "Asia-Pacific Financial Curriculum",
    "Asia-Pacific regional strategy.",
    "USD"
  ),
  "asia-emerging": baseContent(
    "Emerging Asia Financial Curriculum",
    "High-growth emerging markets.",
    "USD"
  ),
  mena: baseContent(
    "MENA Financial Curriculum",
    "Middle East & North Africa systems.",
    "USD"
  ),
};
