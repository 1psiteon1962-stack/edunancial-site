import { getStore } from "@netlify/blobs";

import {
  ALL_COUNTRY_CODES,
  DEFAULT_BLOCKED,
  SITE_ACCESS_HISTORY_PREFIX,
  SITE_ACCESS_KEY,
  SITE_ACCESS_STORE,
  SUBDIVISION_LOCATIONS,
  defaultStateFor,
  effectiveState,
  parseOverrides,
  type SiteAccessOverrides,
  type SiteAccessState,
} from "./site-access-policy";

export interface SiteAccessRow {
  code: string;
  name: string;
  kind: "country" | "region";
  state: SiteAccessState;
  defaultState: SiteAccessState;
  sanctionsNote: string | null;
  ownerDecision: boolean;
  reason: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
}

function store() {
  return getStore({ name: SITE_ACCESS_STORE, consistency: "strong" });
}

export async function readSiteAccessOverrides(): Promise<SiteAccessOverrides> {
  return parseOverrides(await store().get(SITE_ACCESS_KEY, { type: "json" }));
}

let displayNames: Intl.DisplayNames | null = null;
function countryName(code: string): string {
  if (code === "XK") return "Kosovo";
  try {
    displayNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function buildSiteAccessRows(overrides: SiteAccessOverrides): SiteAccessRow[] {
  const row = (code: string, name: string, kind: SiteAccessRow["kind"]): SiteAccessRow => ({
    code,
    name,
    kind,
    state: effectiveState(code, overrides),
    defaultState: defaultStateFor(code),
    sanctionsNote: DEFAULT_BLOCKED[code] ?? null,
    ownerDecision: Boolean(overrides[code]),
    reason: overrides[code]?.reason ?? null,
    updatedBy: overrides[code]?.updatedBy ?? null,
    updatedAt: overrides[code]?.updatedAt ?? null,
  });
  return [
    ...ALL_COUNTRY_CODES.map((code) => row(code, countryName(code), "country")),
    ...Object.entries(SUBDIVISION_LOCATIONS).map(([code, name]) => row(code, name, "region")),
  ].sort((a, b) => a.name.localeCompare(b.name));
}

export async function setSiteAccess(code: string, state: SiteAccessState, reason: string | null, updatedBy: string) {
  const overrides = await readSiteAccessOverrides();
  const previous = effectiveState(code, overrides);
  const updatedAt = new Date().toISOString();
  overrides[code] = { state, reason, updatedBy, updatedAt };
  await store().setJSON(SITE_ACCESS_KEY, overrides);
  // Append-only audit trail of every owner decision.
  await store().setJSON(`${SITE_ACCESS_HISTORY_PREFIX}${updatedAt}-${code}`, { code, previous, state, reason, updatedBy, updatedAt });
  return { code, previous, state, updatedAt };
}
