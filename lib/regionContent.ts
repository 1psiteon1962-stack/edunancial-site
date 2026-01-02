// lib/regionContent.ts

import { Language } from "@/lib/language";
import { RegionCurriculumContent } from "@/components/RegionCurriculum";

type RegionMap = Record<string, Record<Language, RegionCurriculumContent>>;

export const regionContent: RegionMap = {
  us: {
    en: {
      title: "US Financial Foundations",
      description: "Core financial literacy for the United States market.",
      curriculum: [
        "Banking & Credit",
        "US Taxes",
        "Investing Basics",
        "Business Formation",
      ],
      pricing: { currency: "USD", monthly: 29, annual: 299 },
    },
    es: {
      title: "Fundamentos Financieros de EE.UU.",
      description: "Educación financiera esencial para EE.UU.",
      curriculum: [
        "Banca y Crédito",
        "Impuestos",
        "Inversiones",
        "Negocios",
      ],
      pricing: { currency: "USD", monthly: 29, annual: 299 },
    },
    fr: null as any,
    de: null as any,
    ar: null as any,
    zh: null as any,
    ja: null as any,
    hi: null as any,
  },

  mena: {
    en: {
      title: "MENA Market Curriculum",
      description: "Finance, trade, and entrepreneurship in MENA.",
      curriculum: [
        "Islamic Finance",
        "Cross-Border Trade",
        "Regional Compliance",
      ],
      pricing: { currency: "USD", monthly: 25, annual: 249 },
    },
    es: null as any,
    fr: null as any,
    de: null as any,
    ar: null as any,
    zh: null as any,
    ja: null as any,
    hi: null as any,
  },
};
