const timezoneRegionMap: Record<string, string> = {
  "America/New_York": "north-america",
  "America/Los_Angeles": "north-america",
  "America/Toronto": "north-america",
  "America/Mexico_City": "latin-america-2a",
  "America/Sao_Paulo": "latin-america-2b",
  "Europe/Paris": "europe-2a",
  "Europe/Warsaw": "europe-2b",
  "Asia/Riyadh": "middle-east",
  "Asia/Singapore": "asia",
  "Australia/Sydney": "oceania",
  "Africa/Johannesburg": "africa",
};

const countryRegionMap: Record<string, string> = {
  us: "north-america",
  ca: "north-america",
  mx: "latin-america-2a",
  br: "latin-america-2b",
  eg: "middle-east",
  ae: "middle-east",
  sa: "middle-east",
  qa: "middle-east",
  ng: "africa",
  za: "africa",
  dz: "africa",
  ma: "africa",
  ug: "africa",
  jp: "asia",
  kr: "asia",
  in: "asia",
  sg: "asia",
  cn: "asia",
  tw: "asia",
  hk: "asia",
  au: "oceania",
  nz: "oceania",
  fr: "europe-2a",
  de: "europe-2a",
  gb: "europe-2a",
  pl: "europe-2b",
  cz: "europe-2b",
  hu: "europe-2b",
};

export function parseCountryCodeFromLanguageTag(languageTag: string | undefined) {
  if (!languageTag) {
    return "us";
  }

  const segments = languageTag.split("-");

  if (segments.length < 2) {
    return "us";
  }

  return segments[segments.length - 1].toLowerCase();
}

export function resolveRegion(countryCode: string, timezone: string) {
  const normalizedCountryCode = countryCode.toLowerCase();

  if (countryRegionMap[normalizedCountryCode]) {
    return countryRegionMap[normalizedCountryCode];
  }

  return timezoneRegionMap[timezone] ?? "north-america";
}
