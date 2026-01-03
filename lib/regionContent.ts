import { Language } from "./language";
import { Region } from "./regions";

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
      curriculum: ["Banking", "Credit", "Taxes", "Investing"],
      pricing: { currency: "USD", amount: 0 },
    },
    es: {
      heroTitle: "Currículo financiero de EE. UU.",
      description: "Construye riqueza usando sistemas financieros de EE. UU.",
      curriculum: ["Banca", "Crédito", "Impuestos", "Inversión"],
      pricing: { currency: "USD", amount: 0 },
    },
    fr: {
      heroTitle: "Programme financier américain",
      description: "Construisez votre richesse avec les systèmes américains.",
      curriculum: ["Banque", "Crédit", "Impôts", "Investissement"],
      pricing: { currency: "USD", amount: 0 },
    },
    de: {
      heroTitle: "US-Finanzlehrplan",
      description: "Vermögensaufbau mit US-Finanzsystemen.",
      curriculum: ["Banken", "Kredit", "Steuern", "Investieren"],
      pricing: { currency: "USD", amount: 0 },
    },
    ar: {
      heroTitle: "المنهج المالي الأمريكي",
      description: "بناء الثروة باستخدام الأنظمة المالية الأمريكية.",
      curriculum: ["البنوك", "الائتمان", "الضرائب", "الاستثمار"],
      pricing: { currency: "USD", amount: 0 },
    },
    zh: {
      heroTitle: "美国金融课程",
      description: "使用美国金融体系建立财富。",
      curriculum: ["银行", "信贷", "税收", "投资"],
      pricing: { currency: "USD", amount: 0 },
    },
    ja: {
      heroTitle: "米国金融カリキュラム",
      description: "米国の金融システムで資産形成。",
      curriculum: ["銀行", "信用", "税金", "投資"],
      pricing: { currency: "USD", amount: 0 },
    },
    hi: {
      heroTitle: "अमेरिकी वित्त पाठ्यक्रम",
      description: "अमेरिकी वित्तीय प्रणालियों से संपत्ति बनाएं।",
      curriculum: ["बैंकिंग", "क्रेडिट", "कर", "निवेश"],
      pricing: { currency: "USD", amount: 0 },
    },
  },

  // Placeholder regions — REQUIRED so TS compiles
  africa: {} as any,
  mena: {} as any,
  asia: {} as any,
  "asia-emerging": {} as any,
  "asia-pacific": {} as any,
  europe: {} as any,
};
