import { Language } from "./languages";

export interface RegionPricing {
  currency: string;
  monthly: number;
  quarterly: number;
  annual: number;
  lifetime: number;
  enterprise: number;
}

export interface RegionCurriculumContent {
  title: string;
  description: string;
  curriculum: string[];
  pricing: RegionPricing;
}

export const regionContent: Record<
  string,
  Record<Language, RegionCurriculumContent>
> = {
  "asia-pacific": {
    en: {
      title: "Asia-Pacific Curriculum",
      description: "Business, finance, and entrepreneurship for Asia-Pacific.",
      curriculum: [
        "Foundations of Business",
        "Regional Trade & Supply Chains",
        "Digital Payments & Fintech",
        "Scaling Across Borders",
      ],
      pricing: {
        currency: "USD",
        monthly: 19,
        quarterly: 49,
        annual: 179,
        lifetime: 499,
        enterprise: 1999,
      },
    },
    es: {
      title: "Plan de Asia-Pacífico",
      description: "Negocios y finanzas para Asia-Pacífico.",
      curriculum: [
        "Fundamentos Empresariales",
        "Comercio Regional",
        "Pagos Digitales",
        "Escalamiento Internacional",
      ],
      pricing: {
        currency: "USD",
        monthly: 19,
        quarterly: 49,
        annual: 179,
        lifetime: 499,
        enterprise: 1999,
      },
    },
  },
};
