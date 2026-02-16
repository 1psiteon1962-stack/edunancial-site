// lib/regionCurriculumContent.ts

import type { Language } from "@/lib/i18n";
import type { Region } from "@/lib/regions";

/* =========================
   CURRICULUM TYPES
========================= */

export interface CurriculumEntry {
  title: string;
  description: string;
}

export type RegionCurriculumContent = Record<
  Region,
  Record<Language, CurriculumEntry>
>;

/* =========================
   CURRICULUM CONTENT
========================= */

export const regionCurriculumContent: RegionCurriculumContent = {
  global: {
    en: {
      title: "Global Curriculum",
      description: "Foundational principles applicable worldwide.",
    },
    es: {
      title: "Currículo Global",
      description: "Principios fundamentales aplicables en todo el mundo.",
    },
    fr: {
      title: "Programme mondial",
      description: "Principes fondamentaux applicables dans le monde entier.",
    },
    de: {
      title: "Globaler Lehrplan",
      description: "Grundlegende Prinzipien mit weltweiter Anwendung.",
    },
    it: {
      title: "Curriculum globale",
      description: "Principi fondamentali applicabili a livello globale.",
    },
    pt: {
      title: "Currículo Global",
      description: "Princípios fundamentais aplicáveis em todo o mundo.",
    },
    ar: {
      title: "المنهج العالمي",
      description: "مبادئ أساسية قابلة للتطبيق عالميًا.",
    },
    ja: {
      title: "グローバルカリキュラム",
      description: "世界中で適用可能な基本原則。",
    },
    ko: {
      title: "글로벌 커리큘럼",
      description: "전 세계에 적용 가능한 기본 원칙.",
    },
  },

  us: {
    en: {
      title: "U.S. Curriculum",
      description: "Market, tax, and regulatory structure of the United States.",
    },
    es: {
      title: "Currículo de EE. UU.",
      description: "Estructura del mercado, impuestos y regulación de EE. UU.",
    },
    fr: {
      title: "Programme américain",
      description: "Structure du marché, fiscalité et réglementation des États-Unis.",
    },
    de: {
      title: "US-Lehrplan",
      description: "Markt-, Steuer- und Regulierungsstruktur der USA.",
    },
    it: {
      title: "Curriculum USA",
      description: "Struttura di mercato, fiscale e normativa degli Stati Uniti.",
    },
    pt: {
      title: "Currículo dos EUA",
      description: "Estrutura de mercado, tributária e regulatória dos Estados Unidos.",
    },
    ar: {
      title: "المنهج الأمريكي",
      description: "هيكل السوق والضرائب والتنظيم في الولايات المتحدة.",
    },
    ja: {
      title: "米国カリキュラム",
      description: "米国の市場・税制・規制構造。",
    },
    ko: {
      title: "미국 커리큘럼",
      description: "미국의 시장, 세금 및 규제 구조.",
    },
  },

  latam: {
    en: {
      title: "Latin America Curriculum",
      description: "Informal economies, currency systems, and regional structure.",
    },
    es: {
      title: "Currículo de América Latina",
      description: "Economías informales, sistemas monetarios y estructura regional.",
    },
    fr: {
      title: "Programme Amérique latine",
      description: "Économies informelles, systèmes monétaires et structure régionale.",
    },
    de: {
      title: "Lateinamerika-Lehrplan",
      description: "Informelle Volkswirtschaften, Währungen und regionale Struktur.",
    },
    it: {
      title: "Curriculum America Latina",
      description: "Economie informali, sistemi monetari e struttura regionale.",
    },
    pt: {
      title: "Currículo da América Latina",
      description: "Economias informais, sistemas monetários e estrutura regional.",
    },
    ar: {
      title: "منهج أمريكا اللاتينية",
      description: "الاقتصادات غير الرسمية والأنظمة النقدية والبنية الإقليمية.",
    },
    ja: {
      title: "中南米カリキュラム",
      description: "非公式経済、通貨システム、地域構造。",
    },
    ko: {
      title: "라틴 아메리카 커리큘럼",
      description: "비공식 경제, 통화 시스템 및 지역 구조.",
    },
  },
};
