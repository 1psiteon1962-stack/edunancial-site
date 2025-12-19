// data/content/content.ts
// Canonical content map for homepage
// Safe for Next.js + Netlify (case-sensitive, TS-strict)

import type { Locale } from "../site-config";

export type PageContent = {
  heroTitle: string;
  heroBody: string;
};

export const contentByLocale: Record<Locale, PageContent> = {
  en: {
    heroTitle: "Build Financial Intelligence",
    heroBody: "Education-first tools to help you think, plan, and grow."
  },
  es: {
    heroTitle: "Construye Inteligencia Financiera",
    heroBody: "Educación práctica para pensar, planificar y crecer."
  },
  fr: {
    heroTitle: "Construire l’intelligence financière",
    heroBody: "Des outils éducatifs pour réfléchir, planifier et évoluer."
  }
};
