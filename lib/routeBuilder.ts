import { RegionCode } from "./regions.config";
import { Language } from "./languageSelectors";

/**
 * Canonical route builders.
 * No framework dependency.
 */

export function buildRegionRoot(region: RegionCode): string {
  return `/${region}`;
}

export function buildRegionLang(
  region: RegionCode,
  lang: Language
): string {
  return `/${region}/${lang}`;
}

export function buildLocalizedPath(
  region: RegionCode,
  lang: Language,
  path: string
): string {
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return `/${region}/${lang}/${clean}`;
}
