import { RegionCurriculumContent } from '@/types/curriculum';

export const europeCurriculumContent: Record<string, RegionCurriculumContent> = {
  en: {
    title: 'European Business & Investment Curriculum',
    description:
      'A multi-jurisdiction curriculum designed for EU markets, cross-border trade, and regulatory awareness.',
    curriculum: [
      'EU Business Structures (GmbH, SARL, Ltd, OÜ)',
      'VAT & Cross-Border Tax Basics',
      'EU Labor & Compliance Fundamentals',
      'Capital Formation & Private Investment',
      'Digital Business & AI Regulation (GDPR, AI Act)',
    ],
    pricing: {
      currency: 'EUR',
      monthly: 39,
      quarterly: 109,
      annual: 399,
      lifetime: 999,
      enterprise: 'Custom',
    },
    callToAction: 'Start Your European Curriculum',
  },

  fr: {
    title: 'Programme Européen – Affaires & Investissement',
    description:
      'Programme conçu pour les marchés européens, les structures juridiques et la conformité transfrontalière.',
    curriculum: [
      'Structures juridiques européennes',
      'TVA et fiscalité transfrontalière',
      'Droit du travail et conformité',
      'Investissement privé et capital',
      'Entreprise numérique et IA',
    ],
    pricing: {
      currency: 'EUR',
      monthly: 39,
      quarterly: 109,
      annual: 399,
      lifetime: 999,
      enterprise: 'Sur mesure',
    },
    callToAction: 'Commencer le programme européen',
  },

  es: {
    title: 'Programa Europeo de Negocios e Inversión',
    description:
      'Programa diseñado para mercados europeos, cumplimiento normativo y expansión internacional.',
    curriculum: [
      'Estructuras empresariales europeas',
      'IVA y fiscalidad internacional',
      'Cumplimiento laboral',
      'Capital privado e inversión',
      'Negocios digitales e IA',
    ],
    pricing: {
      currency: 'EUR',
      monthly: 39,
      quarterly: 109,
      annual: 399,
      lifetime: 999,
      enterprise: 'Personalizado',
    },
    callToAction: 'Comenzar programa europeo',
  },
};
