// lib/i18n.ts

export const supportedLanguages = ["en", "es", "fr", "de", "pt", "ar"] as const;
export type Language = (typeof supportedLanguages)[number];

export const REGION_LANGUAGES: Record<
  "us" | "europe" | "africa" | "asia" | "latam" | "mena",
  Language[]
> = {
  us: ["en", "es"],
  europe: ["en", "es", "fr", "de", "pt"],
  africa: ["en", "fr", "ar"],
  asia: ["en"],
  latam: ["es", "en", "pt"],
  mena: ["ar", "en", "fr"],
};

export const DEFAULT_LANGUAGE_BY_REGION: Record<
  keyof typeof REGION_LANGUAGES,
  Language
> = {
  us: "en",
  europe: "en",
  africa: "en",
  asia: "en",
  latam: "es",
  mena: "ar",
};

// Tiny translation helper used by LocalizedDoctrine.
// If you have richer translation logic elsewhere, keep this but adapt inside.
const doctrine: Record<Language, Record<string, string>> = {
  en: {
    missionTitle: "Our Mission",
    missionBody:
      "We teach practical financial literacy with clear systems, real-world examples, and disciplined habits.",
  },
  es: {
    missionTitle: "Nuestra Misión",
    missionBody:
      "Enseñamos educación financiera práctica con sistemas claros, ejemplos reales y hábitos disciplinados.",
  },
  fr: {
    missionTitle: "Notre mission",
    missionBody:
      "Nous enseignons la littératie financière pratique avec des systèmes clairs, des exemples concrets et des habitudes disciplinées.",
  },
  de: {
    missionTitle: "Unsere Mission",
    missionBody:
      "Wir vermitteln praktische Finanzbildung mit klaren Systemen, Beispielen aus der Realität und disziplinierten Gewohnheiten.",
  },
  pt: {
    missionTitle: "Nossa Missão",
    missionBody:
      "Ensinamos educação financeira prática com sistemas claros, exemplos do mundo real e hábitos disciplinados.",
  },
  ar: {
    missionTitle: "مهمتنا",
    missionBody:
      "نُعلّم الثقافة المالية العملية عبر أنظمة واضحة وأمثلة واقعية وعادات منضبطة.",
  },
};

export function t(key: string, lang: Language = "en") {
  return doctrine[lang]?.[key] ?? doctrine.en[key] ?? key;
}
