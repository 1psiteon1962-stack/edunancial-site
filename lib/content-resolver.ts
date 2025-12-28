// lib/content-resolver.ts

import { Region, Language, DEFAULT_LANGUAGE } from "@/lib/core";

/**
 * Canonical page content shape
 */
export type PageCopy = {
  title: string;
  body: string;
};

/**
 * Centralized content map
 * Runtime decides availability — NOT TypeScript
 */
const CONTENT: Record<Region, Partial<Record<Language, PageCopy>>> = {
  US: {
    en: {
      title: "Welcome",
      body: "US English content",
    },
    es: {
      title: "Bienvenido",
      body: "Contenido en español",
    },
  },

  EU: {
    en: {
      title: "Welcome",
      body: "EU English content",
    },
    fr: {
      title: "Bienvenue",
      body: "Contenu français",
    },
  },

  AFRICA: {
    en: {
      title: "Welcome",
      body: "Africa English content",
    },
    fr: {
      title: "Bienvenue",
      body: "Contenu français Afrique",
    },
    ar: {
      title: "مرحبا",
      body: "محتوى عربي",
    },
  },

  LATAM: {
    es: {
      title: "Bienvenido",
      body: "Contenido LATAM en español",
    },
    pt: {
      title: "Bem-vindo",
      body: "Conteúdo LATAM em português",
    },
  },

  MENA: {
    ar: {
      title: "مرحبا",
      body: "محتوى الشرق الأوسط",
    },
    en: {
      title: "Welcome",
      body: "MENA English content",
    },
  },
};

/**
 * Authoritative content resolver
 * ✔ accepts ANY Language
 * ✔ resolves at runtime
 * ✔ never fails TypeScript
 */
export function resolveCopy(
  region: Region,
  language: Language
): PageCopy | null {
  return (
    CONTENT[region]?.[language] ??
    CONTENT[region]?.[DEFAULT_LANGUAGE] ??
    null
  );
}
