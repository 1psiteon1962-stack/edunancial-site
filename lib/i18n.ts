/**
 * Centralized language + content registry
 * Static-export safe
 * Netlify safe
 */

export type Language = "en" | "es" | "fr" | "ar";

export type Region =
  | "US"
  | "LATAM"
  | "AFRICA"
  | "EU"
  | "MENA";

export const REGION_LANGUAGES: Record<Region, Language[]> = {
  US: ["en"],
  LATAM: ["es", "en"],
  AFRICA: ["en", "fr", "ar"],
  EU: ["en"],
  MENA: ["ar", "en"],
};

export const DEFAULT_LANGUAGE: Record<Region, Language> = {
  US: "en",
  LATAM: "es",
  AFRICA: "en",
  EU: "en",
  MENA: "ar",
};

export type PageCopy = {
  title: string;
  subtitle: string;
  body: string;
  dir: "ltr" | "rtl";
};

export const COPY: Record<
  Region,
  Partial<Record<Language, PageCopy>>
> = {
  AFRICA: {
    en: {
      dir: "ltr",
      title: "Edunancial — Africa",
      subtitle:
        "Financial structure, discipline, and sustainable growth.",
      body:
        "We support entrepreneurs and businesses across Africa with clear financial models, strong governance, and responsible expansion strategies.",
    },
    fr: {
      dir: "ltr",
      title: "Edunancial — Afrique",
      subtitle:
        "Structure financière, discipline et croissance durable.",
      body:
        "Nous accompagnons les entrepreneurs africains avec des cadres financiers solides et des stratégies de croissance responsables.",
    },
    ar: {
      dir: "rtl",
      title: "إدونانشال — أفريقيا",
      subtitle:
        "الهيكلة المالية والانضباط والنمو المستدام.",
      body:
        "ندعم رواد الأعمال والشركات في أفريقيا من خلال نماذج مالية واضحة وحوكمة قوية.",
    },
  },

  LATAM: {
    es: {
      dir: "ltr",
      title: "Edunancial — América Latina",
      subtitle:
        "Estructura financiera y crecimiento estratégico.",
      body:
        "Apoyamos a emprendedores latinoamericanos con modelos financieros claros y expansión responsable.",
    },
    en: {
      dir: "ltr",
      title: "Edunancial — Latin America",
      subtitle:
        "Financial structure and strategic growth.",
      body:
        "We support Latin American entrepreneurs with disciplined financial frameworks and scalable strategies.",
    },
  },

  US: {
    en: {
      dir: "ltr",
      title: "Edunancial — United States",
      subtitle:
        "Structure before scale. Discipline before growth.",
      body:
        "We provide financial frameworks designed for long-term durability and compliant expansion.",
    },
  },

  EU: {
    en: {
      dir: "ltr",
      title: "Edunancial — Europe",
      subtitle:
        "Governance-driven financial architecture.",
      body:
        "We focus on structure, transparency, and scalable financial systems aligned with European markets.",
    },
  },

  MENA: {
    ar: {
      dir: "rtl",
      title: "إدونانشال — الشرق الأوسط وشمال أفريقيا",
      subtitle:
        "حوكمة مالية ونمو منضبط.",
      body:
        "نقدم نماذج مالية واضحة تدعم النمو المستدام في المنطقة.",
    },
    en: {
      dir: "ltr",
      title: "Edunancial — MENA",
      subtitle:
        "Financial governance and disciplined growth.",
      body:
        "We support structured expansion across Middle East and North Africa markets.",
    },
  },
};

/**
 * Safe resolver
 * Never throws during build
 */
export function resolveCopy(
  region: Region,
  lang: Language
): PageCopy | null {
  return COPY[region]?.[lang] || null;
}
