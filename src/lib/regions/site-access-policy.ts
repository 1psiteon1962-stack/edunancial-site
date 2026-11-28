/**
 * Website access policy: which visitor locations may enter edunancial.com at all.
 *
 * This is separate from country launch/sales state (runtime-controls.ts). A
 * BLOCKED location receives no page, no API, and no content. The owner can
 * open or block any location from /admin/site-access; the defaults below only
 * apply until the owner records a decision.
 *
 * Imported by the Netlify edge gate (netlify/edge-functions/country-gate.ts),
 * so this file must stay dependency-free and use relative imports only.
 */

export type SiteAccessState = "OPEN" | "BLOCKED";

export interface SiteAccessOverride {
  state: SiteAccessState;
  reason: string | null;
  updatedBy: string | null;
  updatedAt: string;
}

export type SiteAccessOverrides = Record<string, SiteAccessOverride>;

export const SITE_ACCESS_STORE = "site-access-controls";
export const SITE_ACCESS_KEY = "overrides";
export const SITE_ACCESS_HISTORY_PREFIX = "history/";

/** ISO 3166-1 alpha-2 codes, plus XK (Kosovo) as used by geolocation providers. */
export const ALL_COUNTRY_CODES: readonly string[] = (
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ " +
  "CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR " +
  "GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP " +
  "KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT " +
  "MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW " +
  "SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG " +
  "UM US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW"
).split(" ");

/**
 * Sub-national areas that can be blocked independently of their country.
 * Keys are "<COUNTRY>-<SUBDIVISION>" using the ISO 3166-2 suffix supplied by
 * Netlify geolocation.
 */
export const SUBDIVISION_LOCATIONS: Readonly<Record<string, string>> = {
  "UA-43": "Crimea (Ukraine)",
  "UA-40": "Sevastopol (Ukraine)",
  "UA-14": "Donetsk region (Ukraine)",
  "UA-09": "Luhansk region (Ukraine)",
};

/**
 * Locations blocked by default: the jurisdictions under comprehensive U.S.
 * (OFAC) embargo as of November 2026 — Cuba, Iran, North Korea, and the
 * Russian-occupied Crimea, Donetsk and Luhansk regions of Ukraine. Syria's
 * comprehensive program ended 1 July 2025 (EO 14312), so it is open by default.
 * The owner may reopen any of these when U.S. policy changes.
 */
export const DEFAULT_BLOCKED: Readonly<Record<string, string>> = {
  CU: "U.S. comprehensive embargo (OFAC Cuban Assets Control Regulations)",
  IR: "U.S. comprehensive embargo (OFAC Iranian Transactions and Sanctions Regulations)",
  KP: "U.S. comprehensive embargo (OFAC North Korea Sanctions Regulations)",
  "UA-43": "U.S. comprehensive embargo (OFAC Crimea region sanctions)",
  "UA-40": "U.S. comprehensive embargo (OFAC Crimea region sanctions)",
  "UA-14": "U.S. comprehensive embargo (OFAC so-called DNR region sanctions)",
  "UA-09": "U.S. comprehensive embargo (OFAC so-called LNR region sanctions)",
};

export function isKnownLocation(code: string): boolean {
  return ALL_COUNTRY_CODES.includes(code) || code in SUBDIVISION_LOCATIONS;
}

/**
 * Default before any owner decision: U.S. sanctions first, then the owner's
 * country access plan (language/market rules). Subdivisions follow sanctions only.
 */
export function defaultStateFor(code: string): SiteAccessState {
  if (code in DEFAULT_BLOCKED) return "BLOCKED";
  if (code in SUBDIVISION_LOCATIONS) return "OPEN";
  return countryPlan(code).on ? "OPEN" : "BLOCKED";
}

export function effectiveState(code: string, overrides: SiteAccessOverrides): SiteAccessState {
  return overrides[code]?.state ?? defaultStateFor(code);
}

function normalizeCountry(value: unknown): string | null {
  const code = String(value ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/u.test(code) || code === "XX" || code === "T1") return null;
  return code;
}

function normalizeSubdivision(value: unknown): string | null {
  const code = String(value ?? "").trim().toUpperCase();
  if (!code) return null;
  // Accept "43" or "UA-43".
  const suffix = code.includes("-") ? code.split("-").pop() ?? "" : code;
  return /^[A-Z0-9]{1,3}$/u.test(suffix) ? suffix : null;
}

/**
 * Decide whether a visitor may enter. Unknown location (no geo data, e.g.
 * server-to-server calls and scheduled functions) is allowed.
 */
export function decideSiteAccess(
  location: { country?: unknown; subdivision?: unknown },
  overrides: SiteAccessOverrides,
): { allowed: boolean; location: string | null } {
  const country = normalizeCountry(location.country);
  if (!country) return { allowed: true, location: null };
  const subdivision = normalizeSubdivision(location.subdivision);
  if (subdivision) {
    const key = `${country}-${subdivision}`;
    if (key in SUBDIVISION_LOCATIONS && effectiveState(key, overrides) === "BLOCKED") {
      return { allowed: false, location: key };
    }
  }
  return { allowed: effectiveState(country, overrides) !== "BLOCKED", location: country };
}

export function parseOverrides(raw: unknown): SiteAccessOverrides {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const result: SiteAccessOverrides = {};
  for (const [code, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!isKnownLocation(code) || !value || typeof value !== "object") continue;
    const entry = value as Record<string, unknown>;
    if (entry.state !== "OPEN" && entry.state !== "BLOCKED") continue;
    result[code] = {
      state: entry.state,
      reason: typeof entry.reason === "string" ? entry.reason : null,
      updatedBy: typeof entry.updatedBy === "string" ? entry.updatedBy : null,
      updatedAt: typeof entry.updatedAt === "string" ? entry.updatedAt : new Date(0).toISOString(),
    };
  }
  return result;
}

// ---------------------------------------------------------------------------
// Owner's country access plan (kept in this file: the edge gate imports it
// without a bundler, so it must stay dependency-free).
// ---------------------------------------------------------------------------
/**
 * Owner's country access plan (Waldemar, 2026-11-27).
 *
 * Rules:
 * - A country is ON only when its language is built (all 5 levels), or the
 *   owner approved serving it in English.
 * - Lower-paying countries stay OFF until the owner decides to serve them.
 * - Legal/political blocks stay OFF (U.S. sanctions are in DEFAULT_BLOCKED;
 *   Yemen is blocked by owner choice).
 *
 * These are DEFAULTS. Any decision the owner makes on /admin/site-access
 * overrides them. Pure data, safe for the edge country gate.
 */

export type PriceTier = "FULL" | "REDUCED" | "FORMULA";
export type PlanReason =
  | "LANGUAGE_READY"
  | "ENGLISH_APPROVED"
  | "WAITING_FOR_LANGUAGE"
  | "NOT_YET_SERVED"
  | "OWNER_POLITICAL_BLOCK";

export interface CountryPlanEntry {
  on: boolean;
  reason: PlanReason;
  /** Language the country is waiting for, when reason is WAITING_FOR_LANGUAGE. */
  language?: string;
  tier: PriceTier;
}

function codes(list: string): string[] {
  return list.trim().split(/\s+/u);
}

/** Countries whose language already exists on the site (all 5 levels). */
const LANGUAGE_READY: Record<string, PriceTier> = {
  // North America
  ...Object.fromEntries(codes("US CA").map((c) => [c, "FULL" as const])),
  // U.S. territories
  ...Object.fromEntries(codes("PR GU VI AS MP UM").map((c) => [c, "FULL" as const])),
  // Latin America (Spanish / Portuguese / English / French / Dutch)
  ...Object.fromEntries(
    codes("MX GT BZ HN SV NI CR PA CO VE EC PE BO BR PY UY AR CL GY SR GF").map((c) => [c, "FORMULA" as const]),
  ),
  // Caribbean
  ...Object.fromEntries(
    codes("DO HT JM TT BB BS AG DM GD KN LC VC AW CW SX BQ KY TC VG AI MS BL MF GP MQ BM").map((c) => [c, "FORMULA" as const]),
  ),
  // Western Europe (English, French, German, Spanish, Portuguese, Italian, Dutch)
  ...Object.fromEntries(
    codes("GB IE IM JE GG FR BE NL LU DE AT CH LI ES PT IT MT SM VA MC AD GI").map((c) => [c, "FULL" as const]),
  ),
};

/** Served in English by owner approval (high English use, full-price markets). */
const ENGLISH_APPROVED: Record<string, PriceTier> = {
  // Gulf 6
  ...Object.fromEntries(codes("SA AE QA KW BH OM").map((c) => [c, "FULL" as const])),
  // Oceania + Asia English markets
  ...Object.fromEntries(codes("AU NZ SG HK").map((c) => [c, "FULL" as const])),
  // Nordics (very high English proficiency)
  ...Object.fromEntries(codes("DK SE NO FI IS").map((c) => [c, "FULL" as const])),
  // India (English now; Hindi on the language list)
  IN: "FORMULA",
};

/** OFF until their language is built. Order follows the owner's language queue. */
const WAITING_FOR_LANGUAGE: Record<string, { language: string; tier: PriceTier }> = {
  TR: { language: "Turkish", tier: "REDUCED" },
  JP: { language: "Japanese", tier: "FULL" },
  KR: { language: "Korean", tier: "FULL" },
  TW: { language: "Traditional Chinese", tier: "FULL" },
  PL: { language: "Polish", tier: "FULL" },
  CZ: { language: "Czech", tier: "FULL" },
  HU: { language: "Hungarian", tier: "FULL" },
  SK: { language: "Slovak", tier: "FULL" },
  SI: { language: "Slovenian", tier: "FULL" },
  HR: { language: "Croatian", tier: "FULL" },
  GR: { language: "Greek", tier: "REDUCED" },
  CY: { language: "Greek", tier: "REDUCED" },
  RO: { language: "Romanian", tier: "REDUCED" },
  BG: { language: "Bulgarian", tier: "REDUCED" },
  UA: { language: "Ukrainian", tier: "REDUCED" },
};

/** Blocked by owner choice for political/legal reasons (not on the OFAC list). */
const OWNER_POLITICAL_BLOCK = new Set(["YE"]);

export function countryPlan(code: string): CountryPlanEntry {
  const key = code.toUpperCase();
  if (OWNER_POLITICAL_BLOCK.has(key)) return { on: false, reason: "OWNER_POLITICAL_BLOCK", tier: "FORMULA" };
  if (key in LANGUAGE_READY) return { on: true, reason: "LANGUAGE_READY", tier: LANGUAGE_READY[key] };
  if (key in ENGLISH_APPROVED) return { on: true, reason: "ENGLISH_APPROVED", tier: ENGLISH_APPROVED[key] };
  const waiting = WAITING_FOR_LANGUAGE[key];
  if (waiting) return { on: false, reason: "WAITING_FOR_LANGUAGE", language: waiting.language, tier: waiting.tier };
  return { on: false, reason: "NOT_YET_SERVED", tier: "FORMULA" };
}

export function planReasonLabel(entry: CountryPlanEntry): string {
  switch (entry.reason) {
    case "LANGUAGE_READY": return "Language ready";
    case "ENGLISH_APPROVED": return "English approved";
    case "WAITING_FOR_LANGUAGE": return `Waiting for ${entry.language ?? "its language"}`;
    case "OWNER_POLITICAL_BLOCK": return "Blocked by owner (political/legal)";
    default: return "Not yet served (owner decision)";
  }
}
