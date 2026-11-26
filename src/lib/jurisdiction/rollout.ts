/**
 * Jurisdiction-application rollout order (owner direction 2026-11-26):
 * US + Canada first, then south: Mexico/PR/DR, Central America,
 * South America, then the Caribbean.
 *
 * This list controls which countries get verified fact sheets and AI
 * explanations, in what order. It does NOT activate a country on the site;
 * public availability is governed by src/lib/regions/architecture.ts
 * launchState/activationPolicy. A country here with an activation hold must
 * still never be shown to learners until that hold is lifted by the owner.
 */
export type RolloutWave = 0 | 1 | 2 | 3 | 4;

export interface RolloutEntry {
  code: string;
  wave: RolloutWave;
  /** Parent jurisdiction whose rules apply unless overridden (territories). */
  inheritsFrom?: string;
  /** Subdivisions whose rules must be layered on top of national rules. */
  subdivisionLayer?: boolean;
  /** Reason the country cannot be activated yet even if fact sheets are complete. */
  activationHold?: string;
}

export const ROLLOUT: RolloutEntry[] = [
  // Wave 0 — launch
  { code: "US", wave: 0, subdivisionLayer: true },
  { code: "CA", wave: 0, subdivisionLayer: true },
  // Wave 1 — bridge south
  { code: "MX", wave: 1, subdivisionLayer: true },
  { code: "PR", wave: 1, inheritsFrom: "US" },
  { code: "DO", wave: 1 },
  // Wave 2 — Central America
  ...["GT", "BZ", "SV", "HN", "NI", "CR", "PA"].map((code) => ({ code, wave: 2 as const })),
  // Wave 3 — South America
  ...["CO", "VE", "EC", "PE", "BO", "CL", "AR", "UY", "PY", "GY", "SR"].map((code) => ({ code, wave: 3 as const })),
  { code: "BR", wave: 3, subdivisionLayer: true },
  // Wave 4 — Caribbean
  ...["JM", "TT", "BS", "BB", "HT", "AG", "DM", "GD", "KN", "LC", "VC"].map((code) => ({ code, wave: 4 as const })),
  { code: "VI", wave: 4, inheritsFrom: "US" },
  {
    code: "CU",
    wave: 4,
    activationHold:
      "sanctions-review: prepared in full (fact sheets, explanations) but must not be activated until the owner approves after legal review of US sanctions and payment rules.",
  },
];

export function getRolloutEntry(code: string): RolloutEntry | undefined {
  const normalized = code.trim().toUpperCase();
  return ROLLOUT.find((entry) => entry.code === normalized);
}

export function getRolloutWave(wave: RolloutWave): RolloutEntry[] {
  return ROLLOUT.filter((entry) => entry.wave === wave);
}

/** True when content may be prepared but must never be shown to learners. */
export function isActivationHeld(code: string): boolean {
  return Boolean(getRolloutEntry(code)?.activationHold);
}
