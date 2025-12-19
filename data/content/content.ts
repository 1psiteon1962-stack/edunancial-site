// data/content.ts

import type { Locale } from "./site-config";

export type PageContent = {
  heroTitle: string;
  heroBody: string;
};

export const contentByLocale: Record<Locale, PageContent> = {
  en: {
    heroTitle: "Build Financial Intelligence",
    heroBody: "Education-first tools for wealth, business, and global opportunity."
  },
  es: {
    heroTitle: "Construye Inteligencia Financiera",
    heroBody: "Educación práctica para riqueza, negocios y oportunidades globales."
  },
  fr: {
    heroTitle: "Construire l’intelligence financière",
    heroBody: "Des outils éducatifs pour la richesse et les opportunités mondiales."
  }
};
