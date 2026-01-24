// lib/curriculumContent/europe.ts

import { RegionCurriculumContent } from "@/lib/types/curriculum";

export const europeCurriculumContent: RegionCurriculumContent = {
  en: {
    title: "European Business & Investment Curriculum",
    description:
      "A multi-jurisdiction curriculum designed for EU markets, cross-border trade, and regulatory awareness.",
    curriculum: [
      {
        title: "Level Thinking in Europe",
        description:
          "Understand how business scaling works inside complex EU legal and tax structures.",
        href: "/levels/level-1",
      },
      {
        title: "Cross-Border Compliance",
        description:
          "Learn the basics of VAT, EU consumer law, and international digital commerce rules.",
        href: "/levels/level-2",
      },
      {
        title: "Capital & Banking Reality",
        description:
          "Why financing is harder in parts of Europe — and how founders structure around it.",
        href: "/levels/level-3",
      },
    ],
  },

  es: {
    title: "Currículo Europeo de Negocios e Inversión",
    description:
      "Un currículo diseñado para mercados de la UE, comercio transfronterizo y conciencia regulatoria.",
    curriculum: [
      {
        title: "Pensamiento por Niveles en Europa",
        description:
          "Comprende cómo funciona el crecimiento empresarial dentro de estructuras legales y fiscales complejas.",
        href: "/levels/level-1",
      },
      {
        title: "Cumplimiento Transfronterizo",
        description:
          "Aprende lo básico sobre IVA, leyes de consumidores de la UE y comercio digital internacional.",
        href: "/levels/level-2",
      },
      {
        title: "Capital y Realidad Bancaria",
        description:
          "Por qué el financiamiento puede ser más difícil — y cómo estructuran los fundadores.",
        href: "/levels/level-3",
      },
    ],
  },
};
