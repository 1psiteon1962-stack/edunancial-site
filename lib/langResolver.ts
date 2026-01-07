import { Language, resolveLanguage } from "./languageSelectors";
import { RegionConfig } from "./regions.config";

/**
 * Language resolver using region constraints.
 */

export function resolveLangParam(
  region: RegionConfig,
  input?: string
): Language {
  const candidate = input as Language | undefined;

  if (!candidate) {
    return region.defaultLanguage;
  }

  return resolveLanguage(region, candidate);
}
