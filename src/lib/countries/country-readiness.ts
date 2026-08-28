import type { CountryConfiguration, CountryStatus } from "@/types/country-config";

export type CountryReadinessDimension =
  | "translations"
  | "legal"
  | "payments"
  | "tax"
  | "privacy"
  | "content"
  | "support";

export type CountryReadiness = Record<CountryReadinessDimension, boolean>;

export interface CountryLaunchAssessment {
  launchReady: boolean;
  commercialReady: boolean;
  missing: CountryReadinessDimension[];
}

const REQUIRED_FOR_LAUNCH: readonly CountryReadinessDimension[] = [
  "translations",
  "legal",
  "payments",
  "tax",
  "privacy",
  "content",
  "support",
];

export function assessCountryLaunchReadiness(
  country: Pick<CountryConfiguration, "enabled" | "status" | "paymentsEnabled">,
  readiness: CountryReadiness,
): CountryLaunchAssessment {
  const missing = REQUIRED_FOR_LAUNCH.filter((dimension) => !readiness[dimension]);
  const statusAllowsLaunch = country.status === "beta" || country.status === "live";
  const launchReady = country.enabled && statusAllowsLaunch && missing.length === 0;

  return {
    launchReady,
    commercialReady: launchReady && country.paymentsEnabled,
    missing,
  };
}

export function canActivateCountry(
  targetStatus: CountryStatus,
  readiness: CountryReadiness,
): boolean {
  if (targetStatus !== "beta" && targetStatus !== "live") return true;
  return REQUIRED_FOR_LAUNCH.every((dimension) => readiness[dimension]);
}
