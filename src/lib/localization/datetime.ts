/**
 * Date & Time formatting module
 *
 * Locale-aware date/time formatting using the native Intl API.
 * No external dependencies.
 */

import { RegionCode, REGION_REGISTRY } from "./engine";

// ─── Format presets ──────────────────────────────────────────────────────────

export type DateStyle = "full" | "long" | "medium" | "short";
export type TimeStyle = "full" | "long" | "medium" | "short";

export interface FormatDateOptions {
  dateStyle?: DateStyle;
  timeStyle?: TimeStyle;
  /** Override the BCP-47 locale used for formatting */
  locale?: string;
  /** Show time component (default: false) */
  includeTime?: boolean;
}

// ─── Date formatter ──────────────────────────────────────────────────────────

/**
 * Formats a Date object (or ISO string / timestamp) for the given region.
 *
 * @example
 *   formatDate(new Date(), "us")                      // "Jul 11, 2026"
 *   formatDate(new Date(), "mena")                    // Arabic-formatted date
 *   formatDate(new Date(), "europe", { dateStyle: "long" })
 */
export function formatDate(
  value: Date | string | number,
  region: RegionCode,
  options: FormatDateOptions = {},
): string {
  const date = value instanceof Date ? value : new Date(value);
  const regionDef = REGION_REGISTRY[region];
  const locale = options.locale ?? regionDef.intlLocale;

  const intlOptions: Intl.DateTimeFormatOptions = {
    dateStyle: options.dateStyle ?? "medium",
  };

  if (options.includeTime) {
    intlOptions.timeStyle = options.timeStyle ?? "short";
  }

  try {
    return new Intl.DateTimeFormat(locale, intlOptions).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

/**
 * Formats only the time component for the given region.
 */
export function formatTime(
  value: Date | string | number,
  region: RegionCode,
  options: { timeStyle?: TimeStyle; locale?: string } = {},
): string {
  const date = value instanceof Date ? value : new Date(value);
  const regionDef = REGION_REGISTRY[region];
  const locale = options.locale ?? regionDef.intlLocale;

  try {
    return new Intl.DateTimeFormat(locale, {
      timeStyle: options.timeStyle ?? "short",
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
}

/**
 * Formats a date range (e.g. subscription period) for a given region.
 */
export function formatDateRange(
  start: Date | string | number,
  end: Date | string | number,
  region: RegionCode,
  options: FormatDateOptions = {},
): string {
  const s = formatDate(start, region, options);
  const e = formatDate(end, region, options);
  const regionDef = REGION_REGISTRY[region];

  // RTL regions: render end before start
  if (regionDef.rtl) return `${e} – ${s}`;
  return `${s} – ${e}`;
}

/**
 * Returns a relative-time string ("3 days ago", "in 2 months") for a region.
 */
export function formatRelativeTime(
  value: Date | string | number,
  region: RegionCode,
  options: { locale?: string } = {},
): string {
  const date = value instanceof Date ? value : new Date(value);
  const regionDef = REGION_REGISTRY[region];
  const locale = options.locale ?? regionDef.intlLocale;

  const diffMs = date.getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  const diffMonth = Math.round(diffDay / 30);
  const diffYear = Math.round(diffDay / 365);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  if (Math.abs(diffHour) < 24) return rtf.format(diffHour, "hour");
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, "day");
  if (Math.abs(diffMonth) < 12) return rtf.format(diffMonth, "month");
  return rtf.format(diffYear, "year");
}
