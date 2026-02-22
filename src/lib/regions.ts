/**
 * REGION TYPE
 * Must match what app/[region]/page.tsx expects
 */
export type Region = {
  slug: string;
  name: string;
  currency: string;
  clientModules: string[];
};

/**
 * MASTER REGION LIST
 */
export const regions: Region[] = [
  {
    slug: "us",
    name: "United States",
    currency: "USD",
    clientModules: [
      "Financial Literacy Basics",
      "Credit Building",
      "Entrepreneur Starter",
      "KPI Readiness Assessment"
    ]
  },
  {
    slug: "latam",
    name: "Latin America",
    currency: "USD",
    clientModules: [
      "Educación Financiera Básica",
      "Construcción de Crédito",
      "Emprendimiento Inicial",
      "Evaluación de Preparación KPI"
    ]
  },
  {
    slug: "africa",
    name: "Africa",
    currency: "USD",
    clientModules: [
      "Financial Foundations",
      "Microenterprise Strategy",
      "Capital Readiness",
      "KPI Growth Tracking"
    ]
  },
  {
    slug: "mena",
    name: "Middle East & North Africa",
    currency: "USD",
    clientModules: [
      "Financial Systems",
      "Business Structuring",
      "Capital Access Strategy",
      "Performance Metrics"
    ]
  },
  {
    slug: "asia",
    name: "Asia",
    currency: "USD",
    clientModules: [
      "Foundational Finance",
      "Operational Scaling",
      "Capital Discipline",
      "KPI Optimization"
    ]
  },
  {
    slug: "eu",
    name: "Europe",
    currency: "USD",
    clientModules: [
      "Financial Governance",
      "Entrepreneur Framework",
      "Capital Structuring",
      "Growth Metrics"
    ]
  }
];

/**
 * Slug validation
 */
export function isRegionSlug(value: unknown): value is string {
  return typeof value === "string" &&
    regions.some(r => r.slug === value);
}

/**
 * Normalize route param
 */
export function normalizeRegion(input: unknown): string {
  if (typeof input !== "string") return "us";
  const v = input.toLowerCase().trim();
  return isRegionSlug(v) ? v : "us";
}

/**
 * Environment fallback
 */
export function getRegionFromEnv(): string {
  const raw = process.env.SITE_REGION?.toLowerCase();
  return isRegionSlug(raw) ? raw : "us";
}
