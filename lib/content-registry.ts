// lib/content-registry.ts
// Central registry for region-based curriculum and track content
// Designed for scalability, KPIs, licensing, and PE/VC readiness

import type { Language } from "./i18n";

/**
 * Supported regions (single source of truth)
 * Add new regions ONLY here.
 */
export type RegionSlug = "us" | "mena" | "latam" | "eu";

/**
 * Core wealth tracks (Edunancial Red / White / Blue)
 */
export type TrackKey = "real_estate" | "paper_assets" | "business";

/**
 * Individual content item (expandable later)
 */
export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  level?: number; // 1–5 thinking level
  language?: Language;
}

/**
 * Track-level content container
 */
export type TrackContent = ContentItem[];

/**
 * Region-level content container
 */
export type RegionContent = Record<TrackKey, TrackContent>;

/**
 * MASTER CONTENT REGISTRY
 * This structure is intentionally explicit:
 * - Enables KPI extraction
 * - Enables region licensing
 * - Enables PE/VC diligence
 * - Prevents silent schema drift
 */
export const regionContentRegistry: Record<RegionSlug, RegionContent> = {
  us: {
    real_estate: [],
    paper_assets: [],
    business: [],
  },

  mena: {
    real_estate: [],
    paper_assets: [],
    business: [],
  },

  latam: {
    real_estate: [],
    paper_assets: [],
    business: [],
  },

  eu: {
    real_estate: [],
    paper_assets: [],
    business: [],
  },
};

/**
 * Utility helpers (optional but safe)
 */
export const ALL_REGIONS: RegionSlug[] = ["us", "mena", "latam", "eu"];
export const ALL_TRACKS: TrackKey[] = [
  "real_estate",
  "paper_assets",
  "business",
];
