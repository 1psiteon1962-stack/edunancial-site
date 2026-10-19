const timezoneRegionMap: Record<string, string> = {
  "America/New_York": "north-america",
  "America/Los_Angeles": "north-america",
  "America/Toronto": "north-america",
  "America/Mexico_City": "latin-america-2a",
  "America/Sao_Paulo": "latin-america-2b",
  "Europe/Paris": "europe-2a",
  "Europe/Berlin": "europe-2a",
  "Europe/London": "europe-2a",
  "Europe/Madrid": "europe-2a",
  "Europe/Rome": "europe-2a",
  "Europe/Amsterdam": "europe-2a",
  "Europe/Brussels": "europe-2a",
  "Europe/Lisbon": "europe-2a",
  "Europe/Zurich": "europe-2a",
  "Europe/Warsaw": "europe-2b",
  "Europe/Prague": "europe-2b",
  "Europe/Budapest": "europe-2b",
  "Europe/Bucharest": "europe-2b",
  "Europe/Sofia": "europe-2b",
  "Europe/Zagreb": "europe-2b",
  "Europe/Bratislava": "europe-2b",
  "Europe/Tallinn": "europe-2b",
  "Europe/Riga": "europe-2b",
  "Europe/Vilnius": "europe-2b",
  "Asia/Riyadh": "middle-east",
  "Asia/Singapore": "asia",
  "Australia/Sydney": "oceania",
  "Africa/Johannesburg": "africa",
  "Africa/Lagos": "africa",
  "Africa/Nairobi": "africa",
  "Africa/Cairo": "africa",
};

const countryRegionMap: Record<string, string> = {
  us: "north-america",
  ca: "north-america",
  mx: "latin-america-2a",
  br: "latin-america-2b",
  do: "caribbean",
  pr: "caribbean",
  cu: "caribbean",
  jm: "caribbean",
  bb: "caribbean",
  ht: "caribbean",
  tc: "caribbean",
  tt: "caribbean",
  bs: "caribbean",
  gp: "caribbean",
  mq: "caribbean",
  aw: "caribbean",
  cw: "caribbean",
  eg: "africa",
  ae: "middle-east",
  sa: "middle-east",
  qa: "middle-east",
  ng: "africa",
  ke: "africa",
  za: "africa",
  gh: "africa",
  tz: "africa",
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
  // Europe 2A — Western Europe
  fr: "europe-2a",
  de: "europe-2a",
  gb: "europe-2a",
  es: "europe-2a",
  it: "europe-2a",
  nl: "europe-2a",
  be: "europe-2a",
  pt: "europe-2a",
  ch: "europe-2a",
  at: "europe-2a",
  ie: "europe-2a",
  se: "europe-2a",
  dk: "europe-2a",
  fi: "europe-2a",
  no: "europe-2a",
  lu: "europe-2a",
  // Europe 2B — Eastern / Central Europe
  pl: "europe-2b",
  cz: "europe-2b",
  hu: "europe-2b",
  ro: "europe-2b",
  sk: "europe-2b",
  bg: "europe-2b",
  hr: "europe-2b",
  ee: "europe-2b",
  lv: "europe-2b",
  lt: "europe-2b",
  si: "europe-2b",
  gr: "europe-2b",
  rs: "europe-2b",
  ua: "europe-2b",
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

/**
 * Device time zone -> country. Used only as the first automatic country guess
 * before trusted network geography answers. A browser language tag such as
 * "es-ES" describes the phone's language setting, not where the visitor is,
 * so it must never be the primary country signal (a visitor in the Dominican
 * Republic with a phone set to "Español (España)" is in DO, not ES).
 */
const timezoneCountryMap: Record<string, string> = {
  "America/Santo_Domingo": "do",
  "America/Puerto_Rico": "pr",
  "America/Havana": "cu",
  "America/Jamaica": "jm",
  "America/Barbados": "bb",
  "America/Port-au-Prince": "ht",
  "America/Grand_Turk": "tc",
  "America/Port_of_Spain": "tt",
  "America/Nassau": "bs",
  "America/Guadeloupe": "gp",
  "America/Martinique": "mq",
  "America/Aruba": "aw",
  "America/Curacao": "cw",
  "America/Paramaribo": "sr",
  "America/Cayenne": "gf",
  "America/Mexico_City": "mx",
  "America/Guatemala": "gt",
  "America/El_Salvador": "sv",
  "America/Tegucigalpa": "hn",
  "America/Managua": "ni",
  "America/Costa_Rica": "cr",
  "America/Panama": "pa",
  "America/Bogota": "co",
  "America/Caracas": "ve",
  "America/Lima": "pe",
  "America/Guayaquil": "ec",
  "America/La_Paz": "bo",
  "America/Santiago": "cl",
  "America/Argentina/Buenos_Aires": "ar",
  "America/Buenos_Aires": "ar",
  "America/Montevideo": "uy",
  "America/Asuncion": "py",
  "America/Sao_Paulo": "br",
  "Europe/Madrid": "es",
  "Europe/Lisbon": "pt",
  "Europe/London": "gb",
  "Europe/Paris": "fr",
  "Europe/Amsterdam": "nl",
  "Europe/Berlin": "de",
  "Europe/Rome": "it",
};

export function countryFromTimezone(timezone: string | null | undefined): string | null {
  if (!timezone) return null;
  return timezoneCountryMap[timezone] ?? null;
}

export function resolveRegion(countryCode: string, timezone: string) {
  const normalizedCountryCode = countryCode.toLowerCase();

  if (countryRegionMap[normalizedCountryCode]) {
    return countryRegionMap[normalizedCountryCode];
  }

  return timezoneRegionMap[timezone] ?? "north-america";
}

/** Locale recommendation only for Spanish-language users, never an override of a saved choice. */
export function spanishLocaleForNetworkCountry(countryCode: string): "es-ES" | "es-Caribbean" | null {
  const code = countryCode.trim().toUpperCase();
  if (code === "ES") return "es-ES";
  // All Caribbean, Central American and South American countries, including
  // non-Spanish-speaking neighbors: this selects a Spanish DIALECT only when
  // the visitor's active auto-detected language is already Spanish.
  const regionCodes = new Set([
    "AG","AI","AW","BB","BL","BQ","BS","CU","CW","DM","DO","GD","GP","HT","JM","KN","KY","LC","MF","MQ","MS","PR","SX","TC","TT","VC","VG","VI",
    "BZ","CR","GT","HN","MX","NI","PA","SV",
    "AR","BO","BR","CL","CO","EC","FK","GF","GY","PE","PY","SR","UY","VE",
  ]);
  return regionCodes.has(code) ? "es-Caribbean" : null;
}

/**
 * Regional variant of the visitor's language for their country, e.g. an
 * English speaker in Jamaica -> en-GB, a French speaker in Canada -> fr-CA.
 * Only refines within the same base language; never switches language.
 */
const ENGLISH_GB_COUNTRIES = new Set([
  "GB","IE","IM","JE","GG","GI","JM","BB","TC","BS","TT","AG","LC","VC","GD","KN","DM","KY","VG","AI","MS","BZ","GY","BM",
]);
const FRENCH_FR_COUNTRIES = new Set(["FR","GP","MQ","GF","RE","YT","BL","MF","PM","HT","BE","CH","LU","MC"]);
const PORTUGUESE_PT_COUNTRIES = new Set(["PT","AO","MZ","CV","GW","ST","TL"]);

export function regionalLocaleForNetworkCountry(countryCode: string, languageCode: string): string | null {
  const code = countryCode.trim().toUpperCase();
  const base = languageCode.trim().toLowerCase().split("-")[0];
  if (base === "es") return spanishLocaleForNetworkCountry(code);
  if (base === "en") return ENGLISH_GB_COUNTRIES.has(code) ? "en-GB" : code === "US" ? "en-US" : null;
  if (base === "fr") return code === "CA" ? "fr-CA" : FRENCH_FR_COUNTRIES.has(code) ? "fr-FR" : null;
  if (base === "pt") return code === "BR" ? "pt-BR" : PORTUGUESE_PT_COUNTRIES.has(code) ? "pt-PT" : null;
  return null;
}
