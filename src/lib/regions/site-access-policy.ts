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

export function defaultStateFor(code: string): SiteAccessState {
  return code in DEFAULT_BLOCKED ? "BLOCKED" : "OPEN";
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
