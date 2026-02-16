// src/lib/regionCurriculumContent.ts

import type { Language } from "@/lib/i18n";
import type { Region } from "@/lib/regions";

export type CurriculumEntry = {
  title: string;
  description: string;
};

export type RegionCurriculumContent = Record<
  Region,
  Record<Language, CurriculumEntry>
>;

export const regionCurriculumContent: RegionCurriculumContent = {
  global: {
    en: { title: "Global Curriculum", description: "Worldwide foundations." },
    es: { title: "Currículo Global", description: "Fundamentos mundiales." },
    fr: { title: "Programme mondial", description: "Fondations mondiales." },
    pt: { title: "Currículo Global", description: "Fundamentos globais." },
    ar: { title: "المنهج العالمي", description: "الأسس العالمية." },
    ja: { title: "グローバルカリキュラム", description: "世界的な基盤。" },
    ko: { title: "글로벌 커리큘럼", description: "전 세계적 기초." },
    de: { title: "Globaler Lehrplan", description: "Weltweite Grundlagen." },
    it: { title: "Curriculum globale", description: "Fondamenti globali." },
  },
};
