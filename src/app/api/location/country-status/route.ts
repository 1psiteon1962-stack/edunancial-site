import { NextResponse } from "next/server";

import { getCountryArchitecture } from "@/lib/regions/architecture";
import { getCountryRuntimeControl } from "@/lib/regions/runtime-controls";

export const dynamic = "force-dynamic";

/**
 * Public, read-only on/off state for one country, as set on the admin
 * Regions dashboard (runtime override) or in the regional registry.
 * Used by public pages to hide offers for countries that are turned off.
 */
export async function GET(request: Request) {
  const code = new URL(request.url).searchParams.get("code")?.trim().toUpperCase() ?? "";
  if (!/^[A-Z]{2}$/u.test(code)) {
    return NextResponse.json({ success: false, error: "Invalid country code" }, { status: 400 });
  }

  let launchState: string | null = null;
  let source = "registry";
  try {
    const control = await getCountryRuntimeControl(code);
    if (control) {
      launchState = control.launchState;
      source = control.runtimeOverride ? "dashboard" : "registry";
    }
  } catch {
    // Dashboard store unavailable: fall back to the committed registry state.
  }
  if (!launchState) {
    const configured = getCountryArchitecture(code);
    launchState = configured ? configured.country.launchState ?? configured.region.launchState : null;
  }

  return NextResponse.json(
    { success: true, countryCode: code, launchState, disabled: launchState === "DISABLED", source },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
