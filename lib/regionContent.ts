// lib/regionContent.ts

import type { Language, Region } from "./i18n";

/* =========================
   CONTENT TYPES
========================= */

export type LocaleContent = {
  heroTitle: string;
  description: string;
  curriculum: string[];
  services: string[];
};

export type RegionLocales = Record<Language, LocaleContent>;

export type RegionContent = Record<Region, RegionLocales>;

/* =========================
   REGION CONTENT
========================= */

export const regionContent: RegionContent = {
  us: {
    en: {
      heroTitle: "Financial Education for the United States",
      description: "Learn how money, credit, and law work in the U.S. system.",
      curriculum: ["Banking", "Credit", "Taxes", "Business Structure"],
      services: ["Financial Literacy", "Business Formation", "Risk Education"],
    },
    es: {
      heroTitle: "Educación Financiera para Estados Unidos",
      description: "Aprende cómo funcionan el dinero, crédito y leyes en EE.UU.",
      curriculum: ["Banca", "Crédito", "Impuestos", "Estructura Empresarial"],
      services: ["Educación Financiera", "Creación de Empresas", "Gestión de Riesgo"],
    },
    fr: {
      heroTitle: "Éducation Financière pour les États-Unis",
      description: "Comprendre le système financier et juridique américain.",
      curriculum: ["Banque", "Crédit", "Fiscalité", "Structure d’Entreprise"],
      services: ["Littératie Financière", "Création d’Entreprise", "Gestion des Risques"],
    },
    ar: {
      heroTitle: "التعليم المالي في الولايات المتحدة",
      description: "فهم النظام المالي والقانوني الأمريكي.",
      curriculum: ["الخدمات المصرفية", "الائتمان", "الضرائب", "هيكلة الأعمال"],
      services: ["التثقيف المالي", "تأسيس الشركات", "إدارة المخاطر"],
    },
    pt: {
      heroTitle: "Educação Financeira para os Estados Unidos",
      description: "Entenda o sistema financeiro e jurídico dos EUA.",
      curriculum: ["Bancos", "Crédito", "Impostos", "Estrutura Empresarial"],
      services: ["Educação Financeira", "Abertura de Empresas", "Gestão de Risco"],
    },
  },

  /* =========================
     LATAM — FIXED
  ========================= */

  latam: {
    es: {
      heroTitle: "Educación Financiera para América Latina",
      description: "Estrategias financieras adaptadas a economías latinoamericanas.",
      curriculum: ["Banca Regional", "Crédito", "Impuestos", "Negocios"],
      services: ["Educación Financiera", "Formalización Empresarial"],
    },
    en: {
      heroTitle: "Financial Education for Latin America",
      description: "Financial strategies tailored to Latin American economies.",
      curriculum: ["Regional Banking", "Credit", "Taxes", "Business"],
      services: ["Financial Literacy", "Business Formalization"],
    },
    fr: {
      heroTitle: "Éducation Financière pour l’Amérique Latine",
      description: "Stratégies financières adaptées aux économies latino-américaines.",
      curriculum: ["Banque Régionale", "Crédit", "Fiscalité", "Affaires"],
      services: ["Littératie Financière", "Formalisation d’Entreprise"],
    },
    ar: {
      heroTitle: "التعليم المالي لأمريكا اللاتينية",
      description: "استراتيجيات مالية مناسبة لاقتصادات أمريكا اللاتينية.",
      curriculum: ["الخدمات المصرفية الإقليمية", "الائتمان", "الضرائب", "الأعمال"],
      services: ["التثقيف المالي", "تنظيم الأعمال"],
    },
    pt: {
      heroTitle: "Educação Financeira para a América Latina",
      description: "Estratégias financeiras para economias latino-americanas.",
      curriculum: ["Bancos Regionais", "Crédito", "Impostos", "Negócios"],
      services: ["Educação Financeira", "Formalização Empresarial"],
    },
  },

  /* =========================
     PLACEHOLDER REGIONS
     (VALID, BUILD-SAFE)
  ========================= */

  caribbean: {} as RegionLocales,
  europe: {} as RegionLocales,
  africa: {} as RegionLocales,
  mena: {} as RegionLocales,
  asia: {} as RegionLocales,
  "asia-pacific": {} as RegionLocales,
  "asia-emerging": {} as RegionLocales,
};
