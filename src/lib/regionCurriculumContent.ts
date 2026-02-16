// src/lib/regionCurriculumContent.ts

import type { Language } from "@/lib/i18n";

/* =========================
   Types
   ========================= */

export type CurriculumEntry = {
  title: string;
  description: string;
};

/**
 * Region-based curriculum content.
 * 
 * NOTE:
 * - `global` is a first-class region.
 * - Additional regions can be added later without breaking the type.
 */
export type RegionCurriculumContent = {
  global: Record<Language, CurriculumEntry>;
};

/* =========================
   Content
   ========================= */

export const regionCurriculumContent: RegionCurriculumContent = {
  global: {
    en: {
      title: "Global Curriculum",
      description: "A globally applicable curriculum focused on structure, discipline, and systems.",
    },
    es: {
      title: "Currículo Global",
      description: "Un currículo aplicable globalmente enfocado en estructura, disciplina y sistemas.",
    },
    fr: {
      title: "Programme mondial",
      description: "Un programme mondial axé sur la structure, la discipline et les systèmes.",
    },
    pt: {
      title: "Currículo Global",
      description: "Um currículo global focado em estrutura, disciplina e sistemas.",
    },
    ar: {
      title: "المنهج العالمي",
      description: "منهج عالمي يركز على الهيكل والانضباط والأنظمة.",
    },
    ja: {
      title: "グローバルカリキュラム",
      description: "構造・規律・システムに焦点を当てたグローバルなカリキュラム。",
    },
    ko: {
      title: "글로벌 커리큘럼",
      description: "구조, 규율, 시스템에 초점을 맞춘 글로벌 커리큘럼.",
    },
    de: {
      title: "Globaler Lehrplan",
      description: "Ein globaler Lehrplan mit Fokus auf Struktur, Disziplin und Systeme.",
    },
    it: {
      title: "Curriculum Globale",
      description: "Un curriculum globale incentrato su struttura, disciplina e sistemi.",
    },
  },
};
