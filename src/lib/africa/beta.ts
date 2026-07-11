// ======================================================
// AFRICA REGIONAL FOUNDATION
// beta.ts – Beta tester integration
// Controls access for early adopters before public launch.
// ======================================================

import { isAfricaFeatureEnabled } from "./config";
import { isCountryInBeta } from "./founder";

export interface AfricaBetaTester {
  /** Unique ID from the platform's user system */
  userId: string;
  email: string;
  countryIso: string;
  /** UTC timestamp when the tester was approved */
  approvedAt: string;
  /** Whether the beta slot is active */
  active: boolean;
}

export interface AfricaBetaAccessResult {
  granted: boolean;
  reason: string;
}

/**
 * In-memory registry of approved beta testers.
 * Replace with a database query in production.
 */
const BETA_TESTERS: AfricaBetaTester[] = [];

/** Register a new beta tester. */
export function registerAfricaBetaTester(
  tester: AfricaBetaTester
): void {
  const exists = BETA_TESTERS.some((t) => t.userId === tester.userId);
  if (!exists) {
    BETA_TESTERS.push(tester);
  }
}

/** Check whether a user has beta access for the Africa region. */
export function checkAfricaBetaAccess(
  userId: string,
  countryIso: string
): AfricaBetaAccessResult {
  if (!isAfricaFeatureEnabled("betaAccess")) {
    return {
      granted: false,
      reason: "Africa beta access is not yet enabled.",
    };
  }

  if (!isCountryInBeta(countryIso)) {
    return {
      granted: false,
      reason: `${countryIso} is not approved for beta access.`,
    };
  }

  const tester = BETA_TESTERS.find(
    (t) =>
      t.userId === userId &&
      t.countryIso.toUpperCase() === countryIso.toUpperCase() &&
      t.active
  );

  if (!tester) {
    return {
      granted: false,
      reason: "User is not registered as an Africa beta tester.",
    };
  }

  return { granted: true, reason: "Beta access granted." };
}

/** Returns all active beta testers for a given country. */
export function getAfricaBetaTestersByCountry(
  countryIso: string
): AfricaBetaTester[] {
  return BETA_TESTERS.filter(
    (t) =>
      t.countryIso.toUpperCase() === countryIso.toUpperCase() && t.active
  );
}
