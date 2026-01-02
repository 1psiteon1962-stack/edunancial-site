import { Language } from "./language";

export type RegionCurriculumContent = {
  heroTitle: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    monthly: number;
    annual: number;
    enterprise?: number;
  };
};

export const regionContent: Record<
  string,
  Record<Language, RegionCurriculumContent>
> = {
  us: {
    en: {
      heroTitle: "U.S. Financial Curriculum",
      description: "Build wealth using U.S. financial systems.",
      curriculum: [
        "Banking & Credit",
        "Investing Basics",
        "Real Estate",
        "Business Formation",
      ],
      pricing: { currency: "USD", monthly: 29, annual: 299 },
    },
    es: {
      heroTitle: "Educación Financiera – EE.UU.",
      description: "Construye riqueza usando sistemas financieros de EE.UU.",
      curriculum: [
        "Banca y Crédito",
        "Inversiones",
        "Bienes Raíces",
        "Creación de Empresas",
      ],
      pricing: { currency: "USD", monthly: 29, annual: 299 },
    },
  },

  mena: {
    ar: {
      heroTitle: "المنهج المالي لمنطقة الشرق الأوسط",
      description: "بناء الثروة في الأسواق الإقليمية والدولية.",
      curriculum: [
        "التمويل الإسلامي",
        "الاستثمار",
        "ريادة الأعمال",
      ],
      pricing: { currency: "USD", monthly: 19, annual: 199 },
    },
    en: {
      heroTitle: "MENA Financial Curriculum",
      description: "Wealth-building across MENA markets.",
      curriculum: [
        "Islamic Finance",
        "Investing",
        "Entrepreneurship",
      ],
      pricing: { currency: "USD", monthly: 19, annual: 199 },
    },
  },
};
