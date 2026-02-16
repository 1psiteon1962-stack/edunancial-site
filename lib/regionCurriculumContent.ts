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
      description: "Market, tax, and regulatory structure of the U.S.",
    },
    es: {
      title: "Currículo de EE. UU.",
      description: "Estructura de mercado, impuestos y regulación en EE. UU.",
    },
    fr: {
      title: "Programme américain",
      description: "Structure du marché, fiscalité et réglementation aux États-Unis.",
    },
    de: {
      title: "US-Lehrplan",
      description: "Markt-, Steuer- und Regulierungsstruktur der USA.",
    },
    it: {
      title: "Curriculum USA",
      description: "Struttura di mercato, fiscale e normativa degli Stati Uniti.",
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
      description: "Informal economies, currency, and regional systems.",
    },
    es: {
      title: "Currículo de América Latina",
      description: "Economías informales, moneda y sistemas regionales.",
    },
    fr: {
      title: "Programme Amérique latine",
      description: "Économies informelles, monnaie et systèmes régionaux.",
    },
    de: {
      title: "Lateinamerika-Lehrplan",
      description: "Informelle Volkswirtschaften, Währungen und regionale Systeme.",
    },
    it: {
      title: "Curriculum America Latina",
      description: "Economie informali, valuta e sistemi regionali.",
    },
    ar: {
      title: "منهج أمريكا اللاتينية",
      description: "الاقتصادات غير الرسمية والعملات والأنظمة الإقليمية.",
    },
    ja: {
      title: "中南米カリキュラム",
      description: "非公式経済、通貨、地域システム。",
    },
    ko: {
      title: "라틴 아메리카 커리큘럼",
      description: "비공식 경제, 통화 및 지역 시스템.",
    },
  },
};
