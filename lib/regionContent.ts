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

export const regionContent: Record<
  Region,
  Record<Language, RegionCurriculumContent>
> = {
  us: {
    en: {
      heroTitle: "U.S. Financial Curriculum",
      description: "Build wealth using U.S. financial systems.",
      curriculum: ["Credit", "Investing", "Taxes", "Business"],
      pricing: { currency: "USD", amount: 0 },
    },
    es: {
      heroTitle: "Currículo Financiero de EE.UU.",
      description: "Construye riqueza usando el sistema estadounidense.",
      curriculum: ["Crédito", "Inversión", "Impuestos", "Negocios"],
      pricing: { currency: "USD", amount: 0 },
    },
    fr: null!,
    de: null!,
    ar: null!,
    zh: null!,
    ja: null!,
    hi: null!,
  },

  europe: {
    en: {
      heroTitle: "European Financial Systems",
      description: "Navigate EU finance and regulation.",
      curriculum: ["Banking", "Compliance", "Investment"],
      pricing: { currency: "EUR", amount: 0 },
    },
    es: null!,
    fr: null!,
    de: null!,
    ar: null!,
    zh: null!,
    ja: null!,
    hi: null!,
  },

  mena: {
    ar: {
      heroTitle: "المنهج المالي للشرق الأوسط",
      description: "بناء الثروة في الأنظمة الإقليمية",
      curriculum: ["الاستثمار", "الأعمال", "الشريعة"],
      pricing: { currency: "USD", amount: 0 },
    },
    en: null!,
    es: null!,
    fr: null!,
    de: null!,
    zh: null!,
    ja: null!,
    hi: null!,
  },

  africa: {
    en: {
      heroTitle: "African Financial Growth",
      description: "Entrepreneurship and capital access.",
      curriculum: ["Microfinance", "Trade", "Startups"],
      pricing: { currency: "USD", amount: 0 },
    },
    es: null!,
    fr: null!,
    de: null!,
    ar: null!,
    zh: null!,
    ja: null!,
    hi: null!,
  },

  asia: {
    zh: {
      heroTitle: "亚洲金融课程",
      description: "区域资本与增长",
      curriculum: ["市场", "技术", "投资"],
      pricing: { currency: "USD", amount: 0 },
    },
    en: null!,
    es: null!,
    fr: null!,
    de: null!,
    ar: null!,
    ja: null!,
    hi: null!,
  },

  "asia-emerging": {
    hi: {
      heroTitle: "उभरते एशियाई बाजार",
      description: "नए वित्तीय अवसर",
      curriculum: ["व्यवसाय", "निवेश"],
      pricing: { currency: "USD", amount: 0 },
    },
    en: null!,
    es: null!,
    fr: null!,
    de: null!,
    ar: null!,
    zh: null!,
    ja: null!,
  },

  "asia-pacific": {
    ja: {
      heroTitle: "アジア太平洋金融",
      description: "地域経済と投資",
      curriculum: ["資本", "市場"],
      pricing: { currency: "USD", amount: 0 },
    },
    en: null!,
    es: null!,
    fr: null!,
    de: null!,
    ar: null!,
    zh: null!,
    hi: null!,
  },
};
