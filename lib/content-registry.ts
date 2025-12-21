export type ContentRegionKey =
  | "US"
  | "LATAM"
  | "AFRICA"
  | "EU"
  | "MENA"
  | "ASIA"
  | "GLOBAL";

export type ContentRegistry = {
  heroHeadline: string;
  heroSubheadline: string;
};

const registry: Record<ContentRegionKey, ContentRegistry> = {
  US: {
    heroHeadline: "Financial Literacy, Built for Real Life.",
    heroSubheadline: "Learn levels 1–5, then apply it with tools, videos, and discipline."
  },
  LATAM: {
    heroHeadline: "Educación financiera práctica, paso a paso.",
    heroSubheadline: "Aprende niveles 1–5 y úsalo en tu vida real."
  },
  AFRICA: {
    heroHeadline: "Practical financial learning that scales.",
    heroSubheadline: "Mobile-first learning built for consistency and long-term growth."
  },
  EU: {
    heroHeadline: "Structured financial education, globally accessible.",
    heroSubheadline: "Clear frameworks, tools, and execution."
  },
  MENA: {
    heroHeadline: "Financial literacy with structure and discipline.",
    heroSubheadline: "Learn the framework, then build your plan."
  },
  ASIA: {
    heroHeadline: "Financial education for builders and operators.",
    heroSubheadline: "Frameworks, tools, and consistent progress."
  },
  GLOBAL: {
    heroHeadline: "Financial Literacy and Education.",
    heroSubheadline: "A global framework for building wealth with clarity."
  }
};

export function getContent(region: string): ContentRegistry {
  const key = (region?.toUpperCase?.() ?? "GLOBAL") as ContentRegionKey;
  return registry[key] ?? registry.GLOBAL;
}
