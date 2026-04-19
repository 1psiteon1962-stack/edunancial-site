// lib/curriculumContent/europe.ts

import { RegionCurriculumContent } from "@/lib/types/curriculum";

/**
 * Europe Curriculum Content
 * Structured by language using RegionCurriculumContent type
 */
export const europeCurriculumContent: RegionCurriculumContent = {
  en: {
    sections: [
      {
        title: "Financial Systems in Europe",
        description:
          "Learn how European financial systems operate across different countries, including banking, taxation, and regulatory frameworks."
      },
      {
        title: "Business Formation and Compliance",
        description:
          "Understand how to start and maintain a business in Europe, including legal structures, compliance obligations, and reporting requirements."
      },
      {
        title: "Investment and Capital Markets",
        description:
          "Explore European stock markets, investment vehicles, and strategies used across the EU and neighboring economies."
      },
      {
        title: "Cross-Border Trade",
        description:
          "Learn how goods and services move across European borders, including customs, VAT, and trade agreements."
      }
    ]
  },

  es: {
    sections: [
      {
        title: "Sistemas Financieros en Europa",
        description:
          "Aprende cómo funcionan los sistemas financieros en Europa, incluyendo bancos, impuestos y regulaciones."
      },
      {
        title: "Formación de Empresas y Cumplimiento",
        description:
          "Entiende cómo crear y mantener una empresa en Europa, incluyendo estructuras legales y requisitos regulatorios."
      },
      {
        title: "Inversiones y Mercados de Capital",
        description:
          "Explora los mercados bursátiles europeos, vehículos de inversión y estrategias utilizadas en la región."
      },
      {
        title: "Comercio Transfronterizo",
        description:
          "Aprende cómo se mueven bienes y servicios entre países europeos, incluyendo aduanas e IVA."
      }
    ]
  }
};
