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

const empty = (title: string): RegionCurriculumContent => ({
  heroTitle: title,
  description: "Localized content coming soon.",
  curriculum: [],
  pricing: { currency: "USD", amount: 0 },
});

const allLanguages = (title: string): Record<Language, RegionCurriculumContent> => ({
  en: empty(title),
  es: empty(title),
  fr: empty(title),
  de: empty(title),
  ar: empty(title),
  zh: empty(title),
  ja: empty(title),
  hi: empty(title),
});

export const regionContent: Record<
  Region,
  Record<Language, RegionCurriculumContent>
> = {
  us: allLanguages("U.S. Financial Curriculum"),
  africa: allLanguages("Africa Financial Curriculum"),
  asia: allLanguages("Asia Financial Curriculum"),
  "asia-emerging": allLanguages("Asia Emerging Markets Curriculum"),
  "asia-pacific": allLanguages("Asia Pacific Curriculum"),
  europe: allLanguages("Europe Financial Curriculum"),
  mena: allLanguages("MENA Financial Curriculum"),
};
