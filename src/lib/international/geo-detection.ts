import {
  DEFAULT_REGION_ID,
  getRegionalConfiguration,
  GlobalRegionId,
  resolveRegionId,
} from "./regions";
import { normalizeLanguageCode } from "./languages";

export interface GeoDetectionInput {
  countryCode?: string;
  timezone?: string;
  acceptLanguage?: string;
}

export interface RegionalExperienceSuggestion {
  regionId: GlobalRegionId;
  language: string;
  currency: string;
  regionalSitePath: string;
  source: "country" | "timezone" | "fallback";
  canManuallyOverride: true;
}

export interface ManualRegionalPreferences {
  regionId?: GlobalRegionId;
  language?: string;
  currency?: string;
}

function parsePrimaryLanguage(acceptLanguage?: string): string {
  const token = acceptLanguage?.split(",")[0]?.split(";")[0]?.trim();
  return normalizeLanguageCode(token);
}

function resolveSuggestionSource(input: GeoDetectionInput): "country" | "timezone" | "fallback" {
  if (input.countryCode) {
    return "country";
  }

  if (input.timezone) {
    return "timezone";
  }

  return "fallback";
}

export function suggestRegionalExperience(
  input: GeoDetectionInput = {}
): RegionalExperienceSuggestion {
  const regionId = resolveRegionId({
    countryCode: input.countryCode,
    timezone: input.timezone,
  });
  const region = getRegionalConfiguration(regionId);
  const language = parsePrimaryLanguage(input.acceptLanguage);
  const supportedLanguage = region.supportedLanguages.includes(language as never)
    ? language
    : region.supportedLanguages[0];

  return {
    regionId,
    language: supportedLanguage,
    currency: region.defaultPricing.currency,
    regionalSitePath: `/regions/${regionId}`,
    source: resolveSuggestionSource(input),
    canManuallyOverride: true,
  };
}

export function applyManualRegionalPreferences(
  suggestion: RegionalExperienceSuggestion,
  manualPreferences: ManualRegionalPreferences = {}
): RegionalExperienceSuggestion {
  const resolvedRegionId = manualPreferences.regionId ?? suggestion.regionId ?? DEFAULT_REGION_ID;
  const region = getRegionalConfiguration(resolvedRegionId);

  return {
    ...suggestion,
    regionId: region.id,
    language: manualPreferences.language
      ? normalizeLanguageCode(manualPreferences.language)
      : suggestion.language,
    currency: manualPreferences.currency ?? suggestion.currency ?? region.defaultPricing.currency,
    regionalSitePath: `/regions/${region.id}`,
    canManuallyOverride: true,
  };
}
