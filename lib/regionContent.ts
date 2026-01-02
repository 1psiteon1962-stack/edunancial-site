import type { Language } from './language';

export type Pricing = {
  currency: string;
  monthly: number;
  annual: number;
  quarterly?: number;
  lifetime?: number;
  enterprise?: number;
};

export type RegionCurriculumContent = {
  title: string;
  description: string;
  curriculum: string[];
  pricing: Pricing;
};

export const regionContent: Record<
  string,
  Record<Language, RegionCurriculumContent>
> = {
  africa: {
    en: {
      title: 'Africa Curriculum',
      description: 'Foundational and growth-focused financial education.',
      curriculum: [
        'Personal finance basics',
        'Small business formation',
        'Local market investing',
        'Cross-border trade fundamentals',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
    es: {
      title: 'África – Plan de Estudios',
      description: 'Educación financiera básica y de crecimiento.',
      curriculum: [
        'Finanzas personales',
        'Creación de pequeñas empresas',
        'Inversión en mercados locales',
        'Comercio transfronterizo',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
    fr: {
      title: 'Afrique – Programme',
      description: 'Éducation financière de base et croissance.',
      curriculum: [
        'Finances personnelles',
        'Création d’entreprise',
        'Investissement local',
        'Commerce transfrontalier',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
    de: {
      title: 'Afrika – Lehrplan',
      description: 'Grundlagen und Wachstum im Finanzbereich.',
      curriculum: [
        'Private Finanzen',
        'Unternehmensgründung',
        'Lokale Investitionen',
        'Grenzüberschreitender Handel',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
    ar: {
      title: 'أفريقيا – المنهج',
      description: 'التعليم المالي الأساسي والنمو.',
      curriculum: [
        'التمويل الشخصي',
        'تأسيس الأعمال',
        'الاستثمار المحلي',
        'التجارة العابرة للحدود',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
    zh: {
      title: '非洲课程',
      description: '基础与成长型金融教育。',
      curriculum: [
        '个人理财',
        '小型企业创建',
        '本地市场投资',
        '跨境贸易',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
    hi: {
      title: 'अफ्रीका पाठ्यक्रम',
      description: 'बुनियादी और विकास-केंद्रित वित्त शिक्षा।',
      curriculum: [
        'व्यक्तिगत वित्त',
        'व्यवसाय निर्माण',
        'स्थानीय निवेश',
        'अंतरराष्ट्रीय व्यापार',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
    ja: {
      title: 'アフリカカリキュラム',
      description: '基礎から成長までの金融教育。',
      curriculum: [
        '個人金融',
        'ビジネス設立',
        '地域投資',
        '国際取引',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
    pt: {
      title: 'África – Currículo',
      description: 'Educação financeira básica e crescimento.',
      curriculum: [
        'Finanças pessoais',
        'Criação de negócios',
        'Investimento local',
        'Comércio internacional',
      ],
      pricing: { currency: 'USD', monthly: 9, annual: 90 },
    },
  },

  asia: {} as any,
  'asia-emerging': {} as any,
  'asia-pacific': {} as any,
  europe: {} as any,
};
