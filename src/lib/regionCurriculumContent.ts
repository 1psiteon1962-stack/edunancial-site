import type { Language } from "@/lib/i18n";

export type CurriculumEntry = {
  title: string;
  description: string;
};

export type RegionCurriculumContent = {
  global: Record<Language, CurriculumEntry>;
};

export const regionCurriculumContent: RegionCurriculumContent = {
  global: {
    en: {
      title: "Global Curriculum",
      description:
        "A globally applicable curriculum focused on structure, discipline, and systems.",
    },
    es: {
      title: "Currículo Global",
      description:
        "Un currículo aplicable globalmente enfocado en estructura, disciplina y sistemas.",
    },
    fr: {
      title: "Programme mondial",
      description:
        "Un programme mondial axé sur la structure, la discipline et les systèmes.",
    },
    de: {
      title: "Globaler Lehrplan",
      description:
        "Ein globaler Lehrplan mit Fokus auf Struktur, Disziplin und Systeme.",
    },
    pt: {
      title: "Currículo Global",
      description:
        "Um currículo global focado em estrutura, disciplina e sistemas.",
    },
    it: {
      title: "Curriculum Globale",
      description:
        "Un curriculum globale incentrato su struttura, disciplina e sistemi.",
    },
    nl: {
      title: "Wereldwijd Curriculum",
      description:
        "Een wereldwijd curriculum gericht op structuur, discipline en systemen.",
    },
    ko: {
      title: "글로벌 커리큘럼",
      description:
        "구조, 규율, 시스템에 초점을 맞춘 글로벌 커리큘럼입니다.",
    },
    ja: {
      title: "グローバルカリキュラム",
      description:
        "構造・規律・システムに焦点を当てたグローバルなカリキュラムです。",
    },
    tl: {
      title: "Pandaigdigang Kurikulum",
      description:
        "Isang pandaigdigang kurikulum na nakatuon sa istruktura, disiplina, at mga sistema.",
    },
    ar: {
      title: "المنهج العالمي",
      description: "منهج عالمي يركز على الهيكل والانضباط والأنظمة.",
    },
  },
};
