// lib/content-resolver.ts

import { Region, Language, DEFAULT_LANGUAGE } from "./core";

/**
 * Canonical resolved content shape
 */
export type ResolvedContent = {
  region: Region;
  language: Language;
  key: string;
};

/**
 * Resolve content safely with fallback
 */
export function resolveContent(
  region: Region,
  language?: Language
): ResolvedContent {
  const resolvedLanguage = language ?? DEFAULT_LANGUAGE;

  return {
    region,
    language: resolvedLanguage,
    key: `${region}-${resolvedLanguage}`,
  };
}
