/**
 * Localization module – public barrel
 *
 * Import everything you need from "@/lib/localization":
 *   import { resolveRegionalization, loadRegionalCurrency, formatCurrency } from "@/lib/localization";
 */

// Core regionalization engine
export {
  resolveRegionFromCountry,
  resolveRegionalization,
  loadRegionalLegalNotices,
  loadRegionalCurrency,
  resolvePaymentRouting,
  REGION_REGISTRY,
} from "./engine";

export type {
  RegionSlug,
  RegionCode,
  LegalNoticeType,
  PaymentProvider,
  LocalizationAssets,
  RegionalContent,
  RegionalizationResolution,
  RegionDefinition,
} from "./engine";

// Currency formatting
export {
  CURRENCY_META,
  formatCurrency,
  getRegionCurrency,
  getRegionCurrencies,
} from "./currency";

export type { CurrencyMeta, FormatCurrencyOptions } from "./currency";

// Date / time formatting
export {
  formatDate,
  formatTime,
  formatDateRange,
  formatRelativeTime,
} from "./datetime";

export type { DateStyle, TimeStyle, FormatDateOptions } from "./datetime";

// Legal text
export { getLegalText, getLegalKey } from "./legalText";
export type { LegalTextPack } from "./legalText";

// Regional management table
export { getRegionalManagementRows } from "./regionalManagement";
export type { RegionalManagementRow } from "./regionalManagement";
