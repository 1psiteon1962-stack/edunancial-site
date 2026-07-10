/**
 * Global SEO Framework
 *
 * Generates localized metadata, hreflang links, Open Graph tags,
 * and sitemap entries for any region — config-driven and launch-control-aware.
 *
 * Non-public regions (PRIVATE, BETA, DISABLED) are automatically excluded
 * from sitemap generation and marked noindex.
 */

import type { Metadata } from "next";
import { isIndexable, isPublic, type LaunchStatus } from "./launch-control";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export const SITE_BASE_URL = "https://www.edunancial.com";

export interface HreflangEntry {
  /** BCP 47 language tag, e.g. "es-MX" */
  hreflang: string;
  href: string;
}

export interface RegionalSEOConfig {
  regionSlug: string;
  regionName: string;
  defaultLanguage: string;
  /** BCP 47 → relative path, e.g. { "es-MX": "/latam/mexico" } */
  localeRoutes: Record<string, string>;
  /** Launch status used to gate indexing */
  launchStatus: LaunchStatus;
}

export interface LocalizedMetadata {
  title: string;
  description: string;
  /** Canonical URL path (without base) */
  path: string;
  locale: string;
  launchStatus: LaunchStatus;
  /** Optional Open Graph image path */
  ogImagePath?: string;
}

// ─────────────────────────────────────────────
// Metadata Generation
// ─────────────────────────────────────────────

/**
 * Generate Next.js Metadata for a regional/country page.
 * Automatically applies noindex when the page is not in ACTIVE status.
 */
export function createRegionalMetadata(
  config: LocalizedMetadata
): Metadata {
  const canonicalUrl = `${SITE_BASE_URL}${config.path}`;
  const shouldIndex = isIndexable(config.launchStatus);

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: config.title,
      description: config.description,
      url: canonicalUrl,
      siteName: "Edunancial",
      type: "website",
      locale: config.locale,
      ...(config.ogImagePath
        ? { images: [{ url: `${SITE_BASE_URL}${config.ogImagePath}` }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
    robots: shouldIndex
      ? { index: true, follow: true }
      : { index: false, follow: false, noarchive: true },
  };
}

// ─────────────────────────────────────────────
// Hreflang
// ─────────────────────────────────────────────

/**
 * Generate hreflang link entries for a regional page.
 * Only generates entries for locales whose launch status allows public access.
 */
export function generateHreflangLinks(
  regionConfig: RegionalSEOConfig
): HreflangEntry[] {
  if (!isPublic(regionConfig.launchStatus)) return [];

  return Object.entries(regionConfig.localeRoutes).map(([hreflang, path]) => ({
    hreflang,
    href: `${SITE_BASE_URL}${path}`,
  }));
}

// ─────────────────────────────────────────────
// Sitemap
// ─────────────────────────────────────────────

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/**
 * Generate sitemap entries for a region.
 * Returns an empty array when the region's launch status is not ACTIVE —
 * ensuring private/beta regions are never indexed.
 */
export function generateRegionalSitemapEntries(
  regionConfig: RegionalSEOConfig,
  lastModified = new Date()
): SitemapEntry[] {
  if (!isPublic(regionConfig.launchStatus)) return [];

  return Object.values(regionConfig.localeRoutes).map((path) => ({
    url: `${SITE_BASE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
}
