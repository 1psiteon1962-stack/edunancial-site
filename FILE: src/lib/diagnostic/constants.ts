import type { FounderStage } from "./types";

export const DEFAULT_REGION = "us";

export const STAGE_OPTIONS: Array<{ value: FounderStage; label: string; blurb: string }> = [
  { value: "idea", label: "Idea / Planning", blurb: "No product yet; validating concept." },
  { value: "pre_revenue", label: "Pre-Revenue", blurb: "Building; no consistent revenue yet." },
  { value: "early_revenue", label: "Early Revenue", blurb: "Some revenue; inconsistent systems." },
  { value: "scaling", label: "Scaling", blurb: "Growing; hiring/processes starting." },
  { value: "established", label: "Established", blurb: "Stable operations; optimizing & expanding." },
];

export const INDUSTRY_OPTIONS = [
  "Professional Services",
  "E-commerce",
  "Construction / Trades",
  "Real Estate",
  "Healthcare",
  "Finance / FinTech",
  "Education",
  "Media",
  "Logistics",
  "Other",
] as const;

export function normalizeEmail(raw: string) {
  return raw.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeRegion(raw: string) {
  return raw.trim().toLowerCase();
}
