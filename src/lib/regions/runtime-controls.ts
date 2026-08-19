import { createClient } from "@supabase/supabase-js";
import { REGION_ARCHITECTURE, type CountryArchitectureConfig, type RegionLaunchState } from "./architecture";

export interface CountryRuntimeControl {
  countryCode: string;
  countryName: string;
  regionCode: string;
  configuredState: RegionLaunchState;
  launchState: RegionLaunchState;
  activationPolicy: CountryArchitectureConfig["activationPolicy"];
  runtimeOverride: boolean;
  reason: string | null;
  updatedBy: string | null;
  updatedAt: string | null;
}

function getAdminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Runtime country controls require Supabase server configuration.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function canonicalCountries(): Array<{
  countryCode: string;
  countryName: string;
  regionCode: string;
  configuredState: RegionLaunchState;
  activationPolicy: CountryArchitectureConfig["activationPolicy"];
}> {
  return Object.values(REGION_ARCHITECTURE).flatMap((region) =>
    region.countries.map((country) => ({
      countryCode: country.countryCode,
      countryName: country.name,
      regionCode: region.code,
      configuredState: country.launchState ?? region.launchState,
      activationPolicy: country.activationPolicy ?? "standard",
    })),
  );
}

export async function getCountryRuntimeControls(): Promise<CountryRuntimeControl[]> {
  const db = getAdminDb();
  const { data, error } = await db
    .from("country_launch_controls")
    .select("country_code,country_name,region_code,launch_state,reason,updated_by,updated_at");
  if (error) throw new Error(error.message);
  const overrides = new Map((data ?? []).map((row) => [row.country_code, row]));
  return canonicalCountries().map((country) => {
    const override = overrides.get(country.countryCode);
    return {
      ...country,
      launchState: (override?.launch_state ?? country.configuredState) as RegionLaunchState,
      runtimeOverride: Boolean(override),
      reason: override?.reason ?? null,
      updatedBy: override?.updated_by ?? null,
      updatedAt: override?.updated_at ?? null,
    };
  });
}

export async function getCountryRuntimeControl(countryCode: string): Promise<CountryRuntimeControl | null> {
  const normalized = countryCode.trim().toUpperCase();
  return (await getCountryRuntimeControls()).find((country) => country.countryCode === normalized) ?? null;
}

export async function assertCountryOperationAllowed(
  countryCode: string,
  allowedStates: readonly RegionLaunchState[] = ["ACTIVE"],
): Promise<CountryRuntimeControl> {
  const control = await getCountryRuntimeControl(countryCode);
  if (!control) throw new Error(`Country ${countryCode} is not in the canonical regional registry.`);
  if (!allowedStates.includes(control.launchState)) {
    throw new Error(`Country ${control.countryCode} is ${control.launchState}; operation is not enabled.`);
  }
  return control;
}
