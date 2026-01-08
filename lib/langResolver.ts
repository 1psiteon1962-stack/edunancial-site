// lib/langResolver.ts

import { Language, resolveLanguage } from './languageSelectors';
import { RegionConfig } from './regions.config';

/**
 * Resolves the effective language for a request
 * based on region configuration and candidate input.
 */
export function resolveRegionLanguage(
  region: RegionConfig,
  candidate: string | undefined
): Language {
  return resolveLanguage(
    candidate,
    region.languages,
    region.defaultLanguage
  );
}
