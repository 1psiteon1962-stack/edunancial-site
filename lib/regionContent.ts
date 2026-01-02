export type Language = 'en' | 'es' | 'fr' | 'de' | 'ar';
export type RegionKey =
  | 'us'
  | 'africa'
  | 'europe'
  | 'asia'
  | 'asia-emerging'
  | 'asia-pacific'
  | 'mena';

export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    monthly: number;
    annual: number;
    lifetime: number;
  };
}

export const regionContent: Record<
  RegionKey,
  Partial<Record<Language, RegionCurriculumContent>>
> = {
  us: {
    en: {
      title: 'United States – Financial Foundations',
      description: 'Core U.S. financial literacy, investing, and business setup.',
      curriculum: [
        'Personal finance fundamentals',
        'Credit and debt strategy',
        'U.S. investing basics',
        'Business entities and taxation',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199, lifetime: 999 },
    },
    es: {
      title: 'Estados Unidos – Fundamentos Financieros',
      description: 'Educación financiera básica y creación de negocios en EE.UU.',
      curriculum: [
        'Finanzas personales',
        'Crédito y deuda',
        'Inversión básica',
        'Estructuras empresariales',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199, lifetime: 999 },
    },
  },

  africa: {
    en: {
      title: 'Africa – Growth & Entrepreneurship',
      description: 'Mobile finance, trade, and business growth in African markets.',
      curriculum: [
        'Mobile money systems',
        'Small business finance',
        'Cross-border trade',
        'Scaling local enterprises',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 89, lifetime: 399 },
    },
  },

  europe: {
    en: {
      title: 'Europe – Multi-Market Finance',
      description: 'EU personal finance, compliance, and investing.',
      curriculum: [
        'EU banking systems',
        'Cross-border compliance',
        'Investing in Europe',
        'SME growth strategies',
      ],
      pricing: { currency: 'EUR', monthly: 15, annual: 149, lifetime: 699 },
    },
  },

  asia: {
    en: {
      title: 'Asia – Advanced Markets',
      description: 'Finance and business in developed Asian economies.',
      curriculum: [
        'Capital markets overview',
        'Corporate structures',
        'Technology-driven finance',
      ],
      pricing: { currency: 'USD', monthly: 15, annual: 149, lifetime: 699 },
    },
  },

  'asia-emerging': {
    en: {
      title: 'Asia Emerging – Financial Mobility',
      description: 'Access, entrepreneurship, and upward mobility.',
      curriculum: [
        'Microfinance',
        'Entrepreneurship basics',
        'Digital payments',
      ],
      pricing: { currency: 'USD', monthly: 7, annual: 69, lifetime: 299 },
    },
  },

  'asia-pacific': {
    en: {
      title: 'Asia-Pacific – Trade & Expansion',
      description: 'Regional trade, logistics, and growth.',
      curriculum: [
        'Regional trade finance',
        'Supply chains',
        'Business expansion',
      ],
      pricing: { currency: 'USD', monthly: 12, annual: 119, lifetime: 599 },
    },
  },

  mena: {
    en: {
      title: 'MENA – Capital & Enterprise',
      description: 'Finance, oil capital, and enterprise development.',
      curriculum: [
        'Regional capital flows',
        'Family offices',
        'Entrepreneurship frameworks',
      ],
      pricing: { currency: 'USD', monthly: 14, annual: 139, lifetime: 649 },
    },
    ar: {
      title: 'الشرق الأوسط وشمال أفريقيا – رأس المال والأعمال',
      description: 'التمويل وريادة الأعمال في المنطقة.',
      curriculum: [
        'التدفقات الرأسمالية',
        'الشركات العائلية',
        'ريادة الأعمال',
      ],
      pricing: { currency: 'USD', monthly: 14, annual: 139, lifetime: 649 },
    },
  },
};
