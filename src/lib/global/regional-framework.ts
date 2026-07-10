/**
 * Global Regional Framework
 *
 * Base configuration interfaces that every region must implement.
 * Regional differences come from config values — not branching code.
 *
 * Designed for: North America, Europe, LATAM, Caribbean,
 *               Africa, Middle East, Asia-Pacific, Oceania.
 */

import type { LaunchStatus, LaunchControlConfig } from "./launch-control";
import type { CurrencyConfig } from "./currency-framework";

// ─────────────────────────────────────────────
// Language
// ─────────────────────────────────────────────

export interface LanguageConfig {
  /** BCP 47 language tag, e.g. "es", "pt-BR" */
  code: string;
  /** English display name */
  name: string;
  /** Native display name */
  nativeName: string;
  /** Text direction */
  direction: "ltr" | "rtl";
}

// ─────────────────────────────────────────────
// Country
// ─────────────────────────────────────────────

export interface CountryConfig {
  /** ISO 3166-1 alpha-2 (lowercase) */
  code: string;
  /** English display name */
  name: string;
  /** Native display name */
  nativeName: string;
  /** ISO 3166-1 alpha-2 uppercase (for hreflang, etc.) */
  iso2: string;
  /** Default currency code (ISO 4217) */
  currency: string;
  /** Primary language BCP 47 code */
  defaultLanguage: string;
  /** All supported language codes for this country */
  languages: string[];
  /** IANA timezone (primary) */
  timezone: string;
  /** Per-country launch status (overrides region default when set) */
  launchStatus?: LaunchStatus;
  /** Sub-region/grouping within the parent region */
  subRegion?: string;
}

// ─────────────────────────────────────────────
// Region
// ─────────────────────────────────────────────

export interface RegionalFrameworkConfig {
  /** Machine-readable slug, e.g. "latam", "europe" */
  slug: string;
  /** Human-readable region name */
  name: string;
  /** Launch control for the whole region + country overrides */
  launchControl: LaunchControlConfig;
  /** Default currency for the region */
  defaultCurrency: CurrencyConfig;
  /** All currencies used in this region (by ISO code) */
  currencies: string[];
  /** Default language BCP 47 code for the region */
  defaultLanguage: string;
  /** All language codes supported in this region */
  languages: string[];
  /** All country configs within this region */
  countries: CountryConfig[];
  /** Route path prefix, e.g. "/latam" */
  routePrefix: string;
  /** Compliance/data-protection notes (informational) */
  complianceNotes?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

/** Get the effective region-level launch status. */
export function getRegionStatus(config: RegionalFrameworkConfig): LaunchStatus {
  return config.launchControl.regionStatus;
}

/** Resolve launch status for a specific country within a region. */
export function getCountryLaunchStatus(
  countryCode: string,
  config: RegionalFrameworkConfig
): LaunchStatus {
  const override = config.launchControl.countryOverrides?.[countryCode.toLowerCase()];
  return override ?? config.launchControl.regionStatus;
}

/** Return all country codes for this region. */
export function getCountryCodes(config: RegionalFrameworkConfig): string[] {
  return config.countries.map((c) => c.code.toLowerCase());
}

/** Look up a country config by its code. */
export function findCountry(
  code: string,
  config: RegionalFrameworkConfig
): CountryConfig | undefined {
  return config.countries.find((c) => c.code.toLowerCase() === code.toLowerCase());
}
