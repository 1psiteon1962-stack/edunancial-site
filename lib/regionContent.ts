// lib/regionContent.ts

import { Language, Region } from "@/lib/i18n";

/* =========================
   Types
========================= */

export type RegionLocaleContent = {
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
 * This must match *all* languages actually used in content.
 */
export type RegionLocales = Record<Language, RegionLocaleContent>;

/* =========================
   Region Content
========================= */

export const regionContent: Record<Region, RegionLocales> = {
  us: {
    en: {
      heroTitle: "US Financial Curriculum",
      description: "Build wealth using the U.S. financial system.",
      curriculum: ["Banking", "Credit", "Taxes", "Business"],
      pricing: { currency: "USD", amount: 0 },
    },
    es: {
      heroTitle: "Currículo Financiero de EE.UU.",
      description: "Construye riqueza usando el sistema financiero estadounidense.",
      curriculum: ["Banca", "Crédito", "Impuestos", "Negocios"],
      pricing: { currency: "USD", amount: 0 },
    },
    fr: {
      heroTitle: "Programme Financier Américain",
      description: "Construisez votre richesse avec le système financier américain.",
      curriculum: ["Banque", "Crédit", "Impôts", "Entreprise"],
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
      description: "Construa riqueza usando o sistema financeiro americano.",
      curriculum: ["Bancos", "Crédito", "Impostos", "Negócios"],
      pricing: { currency: "USD", amount: 0 },
    },
    ar: {
      heroTitle: "المنهج المالي الأمريكي",
      description: "ابنِ ثروتك باستخدام النظام المالي الأمريكي.",
      curriculum: ["البنوك", "الائتمان", "الضرائب", "الأعمال"],
      pricing: { currency: "USD", amount: 0 },
    },
    zh: {
      heroTitle: "美国金融课程",
      description: "使用美国金融体系建立财富。",
      curriculum: ["银行", "信贷", "税收", "商业"],
      pricing: { currency: "USD", amount: 0 },
    },
  },

  // Other regions can be filled incrementally
  europe: {} as RegionLocales,
  mena: {} as RegionLocales,
  asia: {} as RegionLocales,
  apac: {} as RegionLocales,
  asia_emerging: {} as RegionLocales,
  latam: {} as RegionLocales,
  africa: {} as RegionLocales,
};
