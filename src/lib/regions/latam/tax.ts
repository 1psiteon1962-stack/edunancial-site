/**
 * LATAM Tax Configuration
 *
 * Country-specific tax rates for Latin America and the Caribbean.
 * No hard-coded tax logic — all rates are data.
 * Consumed by the shared tax-framework utilities.
 *
 * Sources: publicly available statutory rates (2024–2025).
 * Update rates here only; no code changes required in consuming modules.
 */

import type { CountryTaxConfig } from "@/lib/global/tax-framework";
import { buildTaxRegistry } from "@/lib/global/tax-framework";

// ─────────────────────────────────────────────
// Country Tax Configurations
// ─────────────────────────────────────────────

export const LATAM_TAX_CONFIGS: CountryTaxConfig[] = [
  // ── Central America ───────────────────────
  {
    countryCode: "mx",
    tax: { label: "IVA", type: "IVA", standardRate: 0.16, reducedRate: 0.0, exemptions: ["basic foods", "medicines"] },
  },
  {
    countryCode: "gt",
    tax: { label: "IVA", type: "IVA", standardRate: 0.12 },
  },
  {
    countryCode: "bz",
    tax: { label: "GST", type: "GST", standardRate: 0.125, exemptions: ["basic foods", "medicines"] },
  },
  {
    countryCode: "sv",
    tax: { label: "IVA", type: "IVA", standardRate: 0.13 },
  },
  {
    countryCode: "hn",
    tax: { label: "ISV", type: "IVA", standardRate: 0.15, reducedRate: 0.0, exemptions: ["basic basket"] },
  },
  {
    countryCode: "ni",
    tax: { label: "IVA", type: "IVA", standardRate: 0.15, exemptions: ["basic basket"] },
  },
  {
    countryCode: "cr",
    tax: { label: "IVA", type: "IVA", standardRate: 0.13, reducedRate: 0.04, exemptions: ["basic basket"] },
  },
  {
    countryCode: "pa",
    tax: { label: "ITBMS", type: "IVA", standardRate: 0.07, reducedRate: 0.0, exemptions: ["foods", "medicines", "education"] },
  },

  // ── South America ─────────────────────────
  {
    countryCode: "co",
    tax: { label: "IVA", type: "IVA", standardRate: 0.19, reducedRate: 0.05, exemptions: ["basic foods", "education"] },
  },
  {
    countryCode: "ve",
    tax: { label: "IVA", type: "IVA", standardRate: 0.16, reducedRate: 0.08, exemptions: ["basic basket"] },
  },
  {
    countryCode: "ec",
    tax: { label: "IVA", type: "IVA", standardRate: 0.12, exemptions: ["basic foods", "medicines", "education"] },
  },
  {
    countryCode: "pe",
    tax: { label: "IGV", type: "IVA", standardRate: 0.18, exemptions: ["basic foods", "education"] },
  },
  {
    countryCode: "bo",
    tax: { label: "IVA", type: "IVA", standardRate: 0.13 },
  },
  {
    countryCode: "cl",
    tax: { label: "IVA", type: "IVA", standardRate: 0.19, exemptions: ["exports"] },
  },
  {
    countryCode: "ar",
    tax: { label: "IVA", type: "IVA", standardRate: 0.21, reducedRate: 0.105, exemptions: ["basic foods", "medicines", "education"] },
  },
  {
    countryCode: "uy",
    tax: { label: "IVA", type: "IVA", standardRate: 0.22, reducedRate: 0.10, exemptions: ["basic foods", "medicines"] },
  },
  {
    countryCode: "py",
    tax: { label: "IVA", type: "IVA", standardRate: 0.10, reducedRate: 0.05, exemptions: ["basic foods"] },
  },
  {
    countryCode: "br",
    tax: { label: "ICMS/IPI", type: "IVA", standardRate: 0.17, reducedRate: 0.0, exemptions: ["basic basket", "medicines", "education"] },
  },
  {
    countryCode: "gy",
    tax: { label: "VAT", type: "VAT", standardRate: 0.14, exemptions: ["basic foods", "medicines"] },
  },
  {
    countryCode: "sr",
    tax: { label: "OB", type: "IVA", standardRate: 0.10 },
  },
  {
    countryCode: "gf",
    tax: { label: "TVA", type: "VAT", standardRate: 0.085, exemptions: ["basic foods"] },
  },

  // ── Caribbean ─────────────────────────────
  {
    countryCode: "do",
    tax: { label: "ITBIS", type: "IVA", standardRate: 0.18, reducedRate: 0.16, exemptions: ["basic foods", "medicines", "education"] },
  },
  {
    countryCode: "pr",
    tax: { label: "IVU", type: "SALES_TAX", standardRate: 0.115, exemptions: ["food", "medicines", "clothing"] },
  },
  {
    countryCode: "cu",
    tax: { label: "IVA", type: "IVA", standardRate: 0.10, exemptions: ["basic goods"] },
  },
  {
    countryCode: "jm",
    tax: { label: "GCT", type: "GST", standardRate: 0.15, exemptions: ["basic foods", "medicines"] },
  },
  {
    countryCode: "ht",
    tax: { label: "TCA", type: "IVA", standardRate: 0.10, exemptions: ["basic foods", "medicines"] },
  },
  {
    countryCode: "tt",
    tax: { label: "VAT", type: "VAT", standardRate: 0.125, reducedRate: 0.0, exemptions: ["basic foods", "medicines"] },
  },
  // Caribbean placeholders (rate TBD from official sources)
  { countryCode: "bb", tax: { label: "VAT", type: "VAT", standardRate: 0.175 } },
  { countryCode: "bs", tax: { label: "VAT", type: "VAT", standardRate: 0.10 } },
  { countryCode: "ag", tax: { label: "ABST", type: "GST", standardRate: 0.15 } },
  { countryCode: "dm", tax: { label: "CARICOM CET", type: "IVA", standardRate: 0.15 } },
  { countryCode: "gd", tax: { label: "VAT", type: "VAT", standardRate: 0.15 } },
  { countryCode: "kn", tax: { label: "VAT", type: "VAT", standardRate: 0.17 } },
  { countryCode: "lc", tax: { label: "VAT", type: "VAT", standardRate: 0.125 } },
  { countryCode: "vc", tax: { label: "VAT", type: "VAT", standardRate: 0.15 } },
  { countryCode: "aw", tax: { label: "BBO", type: "IVA", standardRate: 0.015 } },
  { countryCode: "cw", tax: { label: "OB", type: "IVA", standardRate: 0.09 } },
  { countryCode: "sx", tax: { label: "TURNOVER", type: "IVA", standardRate: 0.05 } },
  { countryCode: "bq", tax: { label: "OB", type: "IVA", standardRate: 0.08 } },
  { countryCode: "tc", tax: { label: "NONE", type: "NONE", standardRate: 0 } },
  { countryCode: "ky", tax: { label: "NONE", type: "NONE", standardRate: 0 } },
  { countryCode: "vg", tax: { label: "NONE", type: "NONE", standardRate: 0 } },
  { countryCode: "vi", tax: { label: "GROSS RECEIPTS", type: "SALES_TAX", standardRate: 0.04 } },
  { countryCode: "mq", tax: { label: "TVA", type: "VAT", standardRate: 0.085 } },
  { countryCode: "gp", tax: { label: "TVA", type: "VAT", standardRate: 0.085 } },
];

/** Pre-built registry — O(1) lookups by country code */
export const LATAM_TAX_REGISTRY = buildTaxRegistry(LATAM_TAX_CONFIGS);
