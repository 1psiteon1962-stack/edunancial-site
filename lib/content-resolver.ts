// lib/content-resolver.ts

import { Region, Language, DEFAULT_LANGUAGE } from "@/lib/core";

/**
 * Authoritative page content shape
 * No advice, no promises, no financial claims
 */
export type PageContent = {
  heroTitle: string;
  heroSubtitle: string;
  region: Region;
  language: Language;
};

/**
 * Canonical content map
 * Expand freely without touching logic
 */
const CONTENT: Record<Region, Partial<Record<Language, PageContent>>> = {
  US: {
    en: {
      heroTitle: "Build Discipline Before Capital",
      heroSubtitle: "Structure beats speed. Always.",
      region: "US",
      language: "en",
    },
    es: {
      heroTitle: "Disciplina Antes del Capital",
      heroSubtitle: "La estructura vence a la velocidad.",
      region: "US",
      language: "es",
    },
  },

  EU: {
    en: {
      heroTitle: "Systems Create Stability",
      heroSubtitle: "Growth follows order.",
      region: "EU",
      language: "en",
    },
  },

  AFRICA: {
    en: {
      heroTitle: "Action Creates Survival",
      heroSubtitle: "Execution before theory.",
      region: "AFRICA",
      language: "en",
    },
    fr: {
      heroTitle: "L’Action Crée la Survie",
      heroSubtitle: "L’exécution avant la théorie.",
      region: "AFRICA",
      language: "fr" as Language,
    },
  },

  LATAM: {
    es: {
      heroTitle: "Primero la Acción",
      heroSubtitle: "El progreso comienza hoy.",
      region: "LATAM",
      language: "es",
    },
    pt: {
      heroTitle: "Ação em Primeiro Lugar",
      heroSubtitle: "Progresso começa agora.",
      region: "LATAM",
      language: "pt" as Language,
    },
  },

  MENA: {
    ar: {
      heroTitle: "النظام قبل السرعة",
      heroSubtitle: "الهيكل قبل التوسع.",
      region: "MENA",
      language: "ar" as Language,
    },
    en: {
      heroTitle: "Structure Before Scale",
      heroSubtitle: "Order enables expansion.",
      region: "MENA",
      language: "en",
    },
  },
};

/**
 * Single authoritative resolver
 * NO region-language enforcement
 * NO narrowing
 * NO inference traps
 */
export function resolvePageContent(
  regionId: string,
  languageOverride?: Language
): PageContent {
  const region = regionId as Region;
  const language = languageOverride ?? DEFAULT_LANGUAGE;

  const regionContent = CONTENT[region];
  if (!regionContent) {
    throw new Error(`Unknown region: ${regionId}`);
  }

  const content =
    regionContent[language] ??
    regionContent[DEFAULT_LANGUAGE];

  if (!content) {
    throw new Error(
      `No content for region ${region} in language ${language}`
    );
  }

  return content;
}
