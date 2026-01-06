// lib/regionContent.ts

import { Language, Region } from './i18n';

/**
 * This defines the shape of content per language.
 * NO zh
 * NO experimental locales
 */
export type RegionCopy = {
  heroTitle: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    amount: number;
  };
};

/**
 * Allowed locales ONLY.
 * This MUST stay aligned with i18n.ts
 */
export type RegionLocales = {
  en: RegionCopy;
  es?: RegionCopy;
  fr?: RegionCopy;
  pt?: RegionCopy;
  nl?: RegionCopy;
  ar?: RegionCopy;
};

/**
 * Region → Locale → Content
 * No zh anywhere. Period.
 */
export const regionContent: Record<Region, RegionLocales> = {
  us: {
    en: {
      heroTitle: 'Build Wealth Using the U.S. Financial System',
      description: 'Learn banking, credit, taxes, and capital formation in the United States.',
      curriculum: ['Banking', 'Credit', 'Taxes', 'Business Formation'],
      pricing: { currency: 'USD', amount: 0 },
    },
    es: {
      heroTitle: 'Construya riqueza usando el sistema financiero de EE.UU.',
      description: 'Aprenda banca, crédito, impuestos y creación de capital.',
      curriculum: ['Banca', 'Crédito', 'Impuestos', 'Negocios'],
      pricing: { currency: 'USD', amount: 0 },
    },
  },

  latam: {
    es: {
      heroTitle: 'Educación Financiera para América Latina',
      description: 'Estrategias financieras adaptadas a economías latinoamericanas.',
      curriculum: ['Banca', 'Crédito', 'Remesas', 'Negocios'],
      pricing: { currency: 'USD', amount: 0 },
    },
    pt: {
      heroTitle: 'Educação Financeira para a América Latina',
      description: 'Estratégias financeiras para economias latino-americanas.',
      curriculum: ['Bancos', 'Crédito', 'Negócios'],
      pricing: { currency: 'USD', amount: 0 },
    },
  },

  caribbean: {
    en: {
      heroTitle: 'Caribbean Financial Systems',
      description: 'Financial literacy for island and offshore economies.',
      curriculum: ['Banking', 'Offshore', 'Business', 'Compliance'],
      pricing: { currency: 'USD', amount: 0 },
    },
    fr: {
      heroTitle: 'Systèmes financiers des Caraïbes',
      description: 'Éducation financière pour les économies insulaires.',
      curriculum: ['Banque', 'Entreprise', 'Conformité'],
      pricing: { currency: 'USD', amount: 0 },
    },
    nl: {
      heroTitle: 'Caribische financiële systemen',
      description: 'Financiële educatie voor Caribische economieën.',
      curriculum: ['Banken', 'Bedrijf', 'Compliance'],
      pricing: { currency: 'USD', amount: 0 },
    },
  },

  europe: {
    en: {
      heroTitle: 'European Financial Architecture',
      description: 'Navigate EU and European financial systems.',
      curriculum: ['Banking', 'Regulation', 'Capital'],
      pricing: { currency: 'EUR', amount: 0 },
    },
    fr: {
      heroTitle: 'Architecture financière européenne',
      description: 'Comprendre les systèmes financiers européens.',
      curriculum: ['Banque', 'Réglementation', 'Capital'],
      pricing: { currency: 'EUR', amount: 0 },
    },
  },

  africa: {
    en: {
      heroTitle: 'African Financial Systems',
      description: 'Understand emerging and frontier financial markets.',
      curriculum: ['Banking', 'Mobile Money', 'Trade'],
      pricing: { currency: 'USD', amount: 0 },
    },
    fr: {
      heroTitle: 'Systèmes financiers africains',
      description: 'Marchés financiers émergents et frontières.',
      curriculum: ['Banque', 'Finance mobile', 'Commerce'],
      pricing: { currency: 'USD', amount: 0 },
    },
    ar: {
      heroTitle: 'الأنظمة المالية الإفريقية',
      description: 'فهم الأسواق المالية الناشئة.',
      curriculum: ['البنوك', 'التجارة', 'التمويل'],
      pricing: { currency: 'USD', amount: 0 },
    },
  },

  mena: {
    ar: {
      heroTitle: 'الأنظمة المالية للشرق الأوسط وشمال أفريقيا',
      description: 'التنقل في الأنظمة المالية الإقليمية.',
      curriculum: ['البنوك', 'التمويل', 'التجارة'],
      pricing: { currency: 'USD', amount: 0 },
    },
    en: {
      heroTitle: 'MENA Financial Systems',
      description: 'Regional finance and compliance structures.',
      curriculum: ['Banking', 'Finance', 'Trade'],
      pricing: { currency: 'USD', amount: 0 },
    },
  },

  asia: {
    en: {
      heroTitle: 'Asian Financial Systems',
      description: 'Cross-border finance and growth markets.',
      curriculum: ['Banking', 'Trade', 'Capital'],
      pricing: { currency: 'USD', amount: 0 },
    },
  },
};
