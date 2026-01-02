// lib/regionContent.ts
import { Language } from './language';

export type Pricing = {
  currency: string;
  monthly: number;
  annual: number;
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
  mena: {
    en: {
      title: 'MENA Market Foundations',
      description: 'Business, finance, and compliance for MENA markets.',
      curriculum: [
        'Business formation fundamentals',
        'Cross-border compliance',
        'Capital access in emerging markets',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199 },
    },
    ar: {
      title: 'أساسيات أسواق الشرق الأوسط',
      description: 'الأعمال والتمويل والامتثال للأسواق الإقليمية.',
      curriculum: [
        'تأسيس الأعمال',
        'الامتثال العابر للحدود',
        'الوصول إلى رأس المال',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199 },
    },
    fr: {
      title: 'Fondations Marché MENA',
      description: 'Affaires et finance pour la région MENA.',
      curriculum: [
        'Création d’entreprise',
        'Conformité transfrontalière',
        'Accès au capital',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199 },
    },
    de: {
      title: 'MENA-Marktgrundlagen',
      description: 'Geschäft und Finanzierung für die MENA-Region.',
      curriculum: [
        'Unternehmensgründung',
        'Grenzüberschreitende Compliance',
        'Kapitalzugang',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199 },
    },
    zh: {
      title: '中东北非市场基础',
      description: '中东北非地区的商业与金融。',
      curriculum: [
        '企业设立',
        '跨境合规',
        '资本获取',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199 },
    },
    ja: {
      title: 'MENA市場基礎',
      description: 'MENA地域のビジネスと金融。',
      curriculum: [
        '法人設立',
        '国際コンプライアンス',
        '資本調達',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199 },
    },
    hi: {
      title: 'MENA बाजार की नींव',
      description: 'MENA क्षेत्र के लिए व्यापार और वित्त।',
      curriculum: [
        'व्यवसाय निर्माण',
        'सीमा-पार अनुपालन',
        'पूंजी तक पहुँच',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199 },
    },
    es: {
      title: 'Fundamentos del Mercado MENA',
      description: 'Negocios y finanzas para la región MENA.',
      curriculum: [
        'Creación de empresas',
        'Cumplimiento transfronterizo',
        'Acceso a capital',
      ],
      pricing: { currency: 'USD', monthly: 19, annual: 199 },
    },
  },
};
