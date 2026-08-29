import { NextResponse } from "next/server";

import { getCountryByISO } from "@/lib/countries/country-service";
import { getCountryPricingPolicy } from "@/lib/location/pricing";
import { detectTrustedRequestCountry } from "@/lib/location/request-country";
import { getCanonicalRegionForCountry } from "@/lib/regions/resolver";
import { getCountryRuntimeControl } from "@/lib/regions/runtime-controls";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const detected = detectTrustedRequestCountry(request.headers);
  if (!detected) {
    return NextResponse.json(
      { success: false, detected: false, error: "Country could not be verified from the hosting network." },
      { status: 503, headers: { "Cache-Control": "no-store, private" } },
    );
  }

  const countryCode = detected.countryCode;
  const country = getCountryByISO(countryCode);
  const pricing = getCountryPricingPolicy(countryCode);
  let runtimeControl: Awaited<ReturnType<typeof getCountryRuntimeControl>> = null;
  try {
    runtimeControl = await getCountryRuntimeControl(countryCode);
  } catch {
    // Public detection remains useful if the runtime-control database is temporarily unavailable.
    // Commercial operations still fail closed at checkout.
  }

  return NextResponse.json(
    {
      success: true,
      detected: true,
      countryCode,
      source: detected.source,
      countryName: country?.country ?? runtimeControl?.countryName ?? null,
      region: getCanonicalRegionForCountry(countryCode),
      currency: pricing?.currency ?? country?.currency ?? null,
      pricingAvailable: Boolean(pricing),
      launchState: runtimeControl?.launchState ?? null,
      operationAllowed: runtimeControl ? ["ACTIVE", "BETA"].includes(runtimeControl.launchState) : false,
    },
    { headers: { "Cache-Control": "no-store, private", Vary: "x-nf-country, x-nf-geo, x-vercel-ip-country, cf-ipcountry, cloudfront-viewer-country" } },
  );
}
