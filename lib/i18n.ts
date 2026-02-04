// lib/i18n.ts

/**
 * Central i18n definitions.
 * This file MUST export Language because other modules import it.
 */

/**
 * Supported languages (single source of truth).
 */
export const languages = ["en", "es"] as const;

/**
 * Language type used across the site.
 */
export type Language = (typeof languages)[number];

/**
 * Type guard to validate language strings.
 */
export function isLanguage(value: string): value is Language {
  return (languages as readonly string[]).includes(value);
}
