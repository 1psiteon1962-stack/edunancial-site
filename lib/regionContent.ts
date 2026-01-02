import { Language } from './languages';

export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: {
    currency: string;
    monthly: number;
    annual: number;
    enterprise: string;
  };
}

export const regionContent: Record<
  string,
  Record<Language, RegionCurriculumContent>
> = {
  'asia-pacific': {
    en: {
      title: 'Asia-Pacific Curriculum',
      description: 'Business, finance, and entrepreneurship for APAC markets.',
      curriculum: [
        'Foundations of Entrepreneurship',
        'Regional Market Analysis',
        'Digital Payments & Banking',
        'Cross-Border Trade Basics',
      ],
      pricing: {
        currency: 'USD',
        monthly: 15,
        annual: 150,
        enterprise: 'Contact Sales',
      },
    },
    es: {
      title: 'Programa Asia-Pacífico',
      description:
        'Negocios, finanzas y emprendimiento para mercados APAC.',
      curriculum: [
        'Fundamentos del Emprendimiento',
        'Análisis de Mercados Regionales',
        'Pagos Digitales y Banca',
        'Comercio Transfronterizo',
      ],
      pricing: {
        currency: 'USD',
        monthly: 15,
        annual: 150,
        enterprise: 'Contactar Ventas',
      },
    },
  },
};
