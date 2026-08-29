import { COUNTRY_PRICING_POLICIES } from "@/lib/location/pricing";
import { REGION_ARCHITECTURE, type CanonicalRegionCode, type OperatingSegmentConfig } from "./architecture";

export interface RegionalActivationReadiness {
  ok: boolean;
  countryCode: string;
  regionCode: CanonicalRegionCode;
  deploymentKey: string | null;
  runtimeUrl: string | null;
  pricingReady: boolean;
  independentRuntimeReady: boolean;
  problems: string[];
}

function envSuffix(deploymentKey: string) {
  return deploymentKey.toUpperCase().replace(/[^A-Z0-9]+/gu, "_");
}

function runtimeUrlFor(deploymentKey: string) {
  return process.env[`EDUNANCIAL_RUNTIME_${envSuffix(deploymentKey)}_URL`]?.trim().replace(/\/+$/u, "") ?? "";
}

function segmentForCountry(countryCode: string): { regionCode: CanonicalRegionCode; segment: OperatingSegmentConfig | null } | null {
  const normalized = countryCode.trim().toUpperCase();
  for (const region of Object.values(REGION_ARCHITECTURE)) {
    const country = region.countries.find((candidate) => candidate.countryCode === normalized);
    if (!country) continue;
    const segment = region.operatingSegments?.find((candidate) => candidate.code === country.subregion) ?? region.operatingSegments?.[0] ?? null;
    return { regionCode: region.code, segment };
  }
  return null;
}

export async function getRegionalActivationReadiness(countryCode: string): Promise<RegionalActivationReadiness> {
  const normalized = countryCode.trim().toUpperCase();
  const placement = segmentForCountry(normalized);
  if (!placement) {
    return { ok: false, countryCode: normalized, regionCode: "north-america", deploymentKey: null, runtimeUrl: null, pricingReady: false, independentRuntimeReady: false, problems: ["Country is not in the canonical regional registry."] };
  }

  const pricingReady = Boolean(COUNTRY_PRICING_POLICIES[normalized]);
  const problems: string[] = [];
  if (!pricingReady) problems.push("No approved country pricing policy exists.");

  // North America is the current bootstrap production runtime. Future regions
  // must prove physical runtime isolation before ACTIVE/BETA can be enabled.
  if (placement.regionCode === "north-america") {
    return {
      ok: pricingReady,
      countryCode: normalized,
      regionCode: placement.regionCode,
      deploymentKey: placement.segment?.deploymentKey ?? "north-america-north-america",
      runtimeUrl: null,
      pricingReady,
      independentRuntimeReady: true,
      problems,
    };
  }

  const segment = placement.segment;
  if (!segment?.independentRuntime || !segment.failureDomain || !segment.deploymentKey) {
    problems.push("Country is not assigned to a valid independent operating segment.");
    return { ok: false, countryCode: normalized, regionCode: placement.regionCode, deploymentKey: segment?.deploymentKey ?? null, runtimeUrl: null, pricingReady, independentRuntimeReady: false, problems };
  }

  const runtimeUrl = runtimeUrlFor(segment.deploymentKey);
  if (!runtimeUrl) {
    problems.push(`Independent runtime URL is not configured for ${segment.deploymentKey}.`);
    return { ok: false, countryCode: normalized, regionCode: placement.regionCode, deploymentKey: segment.deploymentKey, runtimeUrl: null, pricingReady, independentRuntimeReady: false, problems };
  }
  if (process.env.NODE_ENV === "production" && !/^https:\/\//iu.test(runtimeUrl)) {
    problems.push("Independent production runtime must use HTTPS.");
    return { ok: false, countryCode: normalized, regionCode: placement.regionCode, deploymentKey: segment.deploymentKey, runtimeUrl, pricingReady, independentRuntimeReady: false, problems };
  }

  let independentRuntimeReady = false;
  try {
    const response = await fetch(`${runtimeUrl}/api/runtime/health`, { method: "GET", cache: "no-store", signal: AbortSignal.timeout(5000) });
    const body = await response.json().catch(() => null) as { ok?: unknown; deploymentKey?: unknown; failureDomain?: unknown } | null;
    independentRuntimeReady = response.ok && body?.ok === true && body?.deploymentKey === segment.deploymentKey && body?.failureDomain === segment.failureDomain;
    if (!independentRuntimeReady) problems.push(`Runtime handshake failed for ${segment.deploymentKey}.`);
  } catch (error) {
    problems.push(error instanceof Error ? `Runtime handshake failed: ${error.message}` : "Runtime handshake failed.");
  }

  return {
    ok: pricingReady && independentRuntimeReady,
    countryCode: normalized,
    regionCode: placement.regionCode,
    deploymentKey: segment.deploymentKey,
    runtimeUrl,
    pricingReady,
    independentRuntimeReady,
    problems,
  };
}
