// lib/regionContent.ts
export type Language = 'en' | 'es' | 'fr' | 'de' | 'ar' | 'pt' | 'zh' | 'hi';

export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    monthly: number;
    annual: number;
    quarterly: number;
    lifetime: number;
  };
}

export const regionContent: Record<
  string,
  Record<Language, RegionCurriculumContent>
> = {
  africa: {
    en: {
      title: 'Africa – Financial Foundations',
      description: 'Entrepreneurship and financial literacy adapted for Africa.',
      curriculum: [
        'Money basics',
        'Mobile banking',
        'Small business foundations',
        'Cross-border trade',
      ],
      pricing: {
        currency: 'USD',
        monthly: 9,
        annual: 90,
        quarterly: 25,
        lifetime: 299,
      },
    },
    fr: {
      title: 'Afrique – Bases financières',
      description:
        'Entrepreneuriat et éducation financière pour l’Afrique.',
      curriculum: [
        'Bases de l’argent',
        'Banque mobile',
        'Fondations des PME',
        'Commerce transfrontalier',
      ],
      pricing: {
        currency: 'EUR',
        monthly: 8,
        annual: 80,
        quarterly: 22,
        lifetime: 249,
      },
    },
    ar: {
      title: 'أفريقيا – الأسس المالية',
      description: 'التعليم المالي وريادة الأعمال لأفريقيا.',
      curriculum: [
        'أساسيات المال',
        'الخدمات المصرفية عبر الهاتف',
        'أساسيات الأعمال',
        'التجارة الإقليمية',
      ],
      pricing: {
        currency: 'USD',
        monthly: 9,
        annual: 90,
        quarterly: 25,
        lifetime: 299,
      },
    },
  },

  asia: {
    en: {
      title: 'Asia – Market Acceleration',
      description: 'Capital markets and scalable business models for Asia.',
      curriculum: [
        'Market analysis',
        'Supply chains',
        'Startup finance',
        'Regional expansion',
      ],
      pricing: {
        currency: 'USD',
        monthly: 12,
        annual: 120,
        quarterly: 35,
        lifetime: 349,
      },
    },
    zh: {
      title: '亚洲 – 市场加速',
      description: '面向亚洲的金融与创业课程。',
      curriculum: [
        '市场分析',
        '供应链',
        '创业金融',
        '区域扩展',
      ],
      pricing: {
        currency: 'USD',
        monthly: 12,
        annual: 120,
        quarterly: 35,
        lifetime: 349,
      },
    },
    hi: {
      title: 'एशिया – बाज़ार विस्तार',
      description: 'एशिया के लिए वित्तीय शिक्षा।',
      curriculum: [
        'बाज़ार विश्लेषण',
        'आपूर्ति श्रृंखला',
        'स्टार्टअप वित्त',
        'क्षेत्रीय विस्तार',
      ],
      pricing: {
        currency: 'USD',
        monthly: 12,
        annual: 120,
        quarterly: 35,
        lifetime: 349,
      },
    },
  },

  'asia-emerging': {
    en: {
      title: 'Asia Emerging – Growth Track',
      description: 'Early-stage capital and business systems.',
      curriculum: [
        'Micro-enterprise',
        'Access to capital',
        'Digital payments',
        'Export readiness',
      ],
      pricing: {
        currency: 'USD',
        monthly: 7,
        annual: 70,
        quarterly: 20,
        lifetime: 199,
      },
    },
  },

  europe: {
    en: {
      title: 'Europe – Regulatory & Markets',
      description: 'EU-focused finance and compliance education.',
      curriculum: [
        'EU markets',
        'Corporate structures',
        'Tax systems',
        'Cross-border investing',
      ],
      pricing: {
        currency: 'EUR',
        monthly: 15,
        annual: 150,
        quarterly: 40,
        lifetime: 399,
      },
    },
    de: {
      title: 'Europa – Regulierung & Märkte',
      description: 'Finanzbildung für Europa.',
      curriculum: [
        'EU-Märkte',
        'Unternehmensstrukturen',
        'Steuersysteme',
        'Grenzüberschreitende Investitionen',
      ],
      pricing: {
        currency: 'EUR',
        monthly: 15,
        annual: 150,
        quarterly: 40,
        lifetime: 399,
      },
    },
  },
};
