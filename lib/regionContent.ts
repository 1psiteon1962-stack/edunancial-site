// lib/regionContent.ts

import { Language } from "./i18n";

/* =========================
   Shared Types
========================= */

export type RegionContent = {
  heroTitle: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    amount: number;
  };
};

/**
 * IMPORTANT:
 * RegionLocales MUST track Language exactly.
 * No hard-coded locale keys.
 */
export type RegionLocales = Record<Language, RegionContent>;

/* =========================
   Region Content
========================= */

export const regionContent: Record<string, RegionLocales> = {
  us: {
    en: {
      heroTitle: "U.S. Financial Curriculum",
      description: "Build wealth using the U.S. financial system.",
      curriculum: ["Banking", "Credit", "Taxes", "Business"],
      pricing: { currency: "USD", amount: 0 },
    },
    es: {
      heroTitle: "Programa Financiero de EE.UU.",
      description: "Construye riqueza usando el sistema financiero de EE.UU.",
      curriculum: ["Banca", "Crédito", "Impuestos", "Negocios"],
      pricing: { currency: "USD", amount: 0 },
    },
    fr: {
      heroTitle: "Programme Financier des États-Unis",
      description: "Créer de la richesse via le système financier américain.",
      curriculum: ["Banque", "Crédit", "Impôts", "Entreprise"],
      pricing: { currency: "USD", amount: 0 },
    },
    zh: {
      heroTitle: "美国金融课程",
      description: "使用美国金融体系建立财富。",
      curriculum: ["银行", "信贷", "税收", "商业"],
      pricing: { currency: "USD", amount: 0 },
    },
    de: {
      heroTitle: "US-Finanzlehrplan",
      description: "Vermögen mit dem US-Finanzsystem aufbauen.",
      curriculum: ["Bankwesen", "Kredit", "Steuern", "Unternehmen"],
      pricing: { currency: "USD", amount: 0 },
    },
    pt: {
      heroTitle: "Currículo Financeiro dos EUA",
      description: "Construa riqueza usando o sistema financeiro dos EUA.",
      curriculum: ["Bancos", "Crédito", "Impostos", "Negócios"],
      pricing: { currency: "USD", amount: 0 },
    },
    ar: {
      heroTitle: "المنهج المالي الأمريكي",
      description: "بناء الثروة باستخدام النظام المالي الأمريكي.",
      curriculum: ["البنوك", "الائتمان", "الضرائب", "الأعمال"],
      pricing: { currency: "USD", amount: 0 },
    },
  },
};
