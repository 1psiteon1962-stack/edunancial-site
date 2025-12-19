// data/content.ts
// Canonical localized homepage content map
// Safe for Next.js + Netlify (case-sensitive, TS-strict)

import type { Locale } from "./site-config";

export type PageContent = {
  heroTitle: string;
  heroBody: string;
};

export const contentByLocale: Record<Locale, PageContent> = {
  en: {
    heroTitle: "Build Financial Intelligence",
    heroBody:
      "Education-first tools for wealth creation, business ownership, and global opportunity."
  },
  es: {
    heroTitle: "Construye Inteligencia Financiera",
    heroBody:
      "Herramientas educativas para crear riqueza, negocios y oportunidades globales."
  },
  fr: {
    heroTitle: "Construire l’intelligence financière",
    heroBody:
      "Des outils éducatifs pour la création de richesse et les opportunités mondiales."
  }
};
