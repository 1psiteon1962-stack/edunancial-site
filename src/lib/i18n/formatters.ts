import { getHtmlLang } from "./a11y";
import { getHtmlDir } from "./rtl";

function toDate(value: Date | string): Date {
  return value instanceof Date ? value : new Date(value);
}

function getIntlLocale(locale: string): string {
  return getHtmlLang(locale);
}

export function formatDate(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), options).format(toDate(date));
}

export function formatTime(
  date: Date | string,
  locale: string,
  options?: Intl.DateTimeFormatOptions
): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    hour: "numeric",
    minute: "2-digit",
    ...options,
  }).format(toDate(date));
}

export function formatNumber(
  value: number,
  locale: string,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), options).format(value);
}

export function formatCurrency(
  amount: number,
  locale: string,
  currency: string
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatRelativeTime(date: Date, locale: string): string {
  const targetTime = date.getTime();
  const now = Date.now();
  const diffInSeconds = Math.round((targetTime - now) / 1000);
  const formatter = new Intl.RelativeTimeFormat(getIntlLocale(locale), {
    numeric: "auto",
  });

  const units = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
    [1, "second"],
  ] as const;

  for (const [seconds, unit] of units) {
    if (Math.abs(diffInSeconds) >= seconds || unit === "second") {
      return formatter.format(
        Math.round(diffInSeconds / seconds),
        unit
      );
    }
  }

  return formatter.format(0, "second");
}

export function getLocaleCalendar(locale: string): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale)).resolvedOptions().calendar;
}

export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  return getHtmlDir(locale);
}

export function getNumberSeparators(locale: string): {
  decimal: string;
  thousands: string;
} {
  const parts = new Intl.NumberFormat(getIntlLocale(locale)).formatToParts(12345.6);
  return {
    decimal: parts.find((part) => part.type === "decimal")?.value ?? ".",
    thousands: parts.find((part) => part.type === "group")?.value ?? ",",
  };
}
