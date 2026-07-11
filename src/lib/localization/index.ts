/**
 * Localization module – public barrel
 *
 * Import everything you need from "@/lib/localization":
 *
 *   import { translate, formatCurrency, formatDate, getLegalText, REGION_FLAGS } from "@/lib/localization";
 */

// Core engine
export {
  SUPPORTED_LANGUAGES,
  REGION_FLAGS,
  REGION_REGISTRY,
  isLocaleCode,
  isRegionEnabled,
  buildFallbackChain,
  translate,
  resolveLocale,
} from "./engine";

export type {
  LocaleCode,
  RegionCode,
  RegionDefinition,
  TranslationPack,
  TranslationTable,
} from "./engine";

// Currency
export {
  CURRENCY_META,
  formatCurrency,
  getRegionCurrency,
  getRegionCurrencies,
} from "./currency";

export type { CurrencyMeta, FormatCurrencyOptions } from "./currency";

// Date / time
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

// Regional management (admin dashboard data)
export { getRegionalManagementRows } from "./regionalManagement";
export type { RegionalManagementRow } from "./regionalManagement";
