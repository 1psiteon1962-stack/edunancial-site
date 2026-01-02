// lib/regionContent.ts
import { Language } from './language';

export type Pricing = {
  currency: string;
  monthly: number;
  annual: number;
  lifetime: number;
};

export type RegionCurriculumContent = {
  title: string;
  description: string;
  curriculum: string[];
  pricing: Pricing;
};

export type RegionKey =
  | 'us'
  | 'africa'
  | 'europe'
  | 'mena'
  | 'asia'
  | 'asia-pacific'
  | 'asia-emerging';

export const regionContent: Record<
  RegionKey,
  Record<Language, RegionCurriculumContent>
> = {
  africa: {
    en: {
      title: 'Africa Business & Investment',
      description: 'Entrepreneurship and capital literacy for Africa.',
      curriculum: ['Business basics', 'Capital access', 'Local markets'],
      pricing: { currency: 'USD', monthly: 15, annual: 150, lifetime: 500 },
    },
    es: {
      title: 'Negocios e Inversión en África',
      description: 'Educación financiera para África.',
      curriculum: ['Negocios', 'Capital', 'Mercados locales'],
      pricing: { currency: 'USD', monthly: 15, annual: 150, lifetime: 500 },
    },
    fr: {
      title: 'Affaires en Afrique',
      description: 'Formation entrepreneuriale.',
      curriculum: ['Affaires', 'Capital', 'Marchés'],
      pricing: { currency: 'USD', monthly: 15, annual: 150, lifetime: 500 },
    },
    de: {
      title: 'Afrika Wirtschaft',
      description: 'Unternehmerische Bildung.',
      curriculum: ['Geschäft', 'Kapital', 'Märkte'],
      pricing: { currency: 'USD', monthly: 15, annual: 150, lifetime: 500 },
    },
    ar: {
      title: 'أعمال أفريقيا',
      description: 'التعليم المالي لأفريقيا.',
      curriculum: ['الأعمال', 'رأس المال', 'الأسواق'],
      pricing: { currency: 'USD', monthly: 15, annual: 150, lifetime: 500 },
    },
    zh: {
      title: '非洲商业',
      description: '商业与投资教育。',
      curriculum: ['商业', '资本', '市场'],
      pricing: { currency: 'USD', monthly: 15, annual: 150, lifetime: 500 },
    },
    ja: {
      title: 'アフリカビジネス',
      description: '起業教育。',
      curriculum: ['ビジネス', '資本', '市場'],
      pricing: { currency: 'USD', monthly: 15, annual: 150, lifetime: 500 },
    },
    hi: {
      title: 'अफ्रीका व्यापार',
      description: 'वित्तीय शिक्षा।',
      curriculum: ['व्यापार', 'पूंजी', 'बाजार'],
      pricing: { currency: 'USD', monthly: 15, annual: 150, lifetime: 500 },
    },
  },

  europe: {} as any,
  mena: {} as any,
  asia: {} as any,
  'asia-pacific': {} as any,
  'asia-emerging': {} as any,
  us: {} as any,
};
