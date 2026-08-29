import { NextRequest, NextResponse } from "next/server";

import { requireAdminApiSession } from "@/lib/admin-content/auth";
import { getRegionalActivationReadiness } from "@/lib/regions/activation-readiness";
import { REGION_ARCHITECTURE, type RegionLaunchState } from "@/lib/regions/architecture";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdminDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Runtime country controls require Supabase server configuration.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function canonicalCountries() {
  return Object.values(REGION_ARCHITECTURE).flatMap((region) =>
    region.countries.map((country) => ({
      countryCode: country.countryCode,
      countryName: country.name,
      regionCode: region.code,
      configuredState: country.launchState ?? region.launchState,
    })),
  );
}

export async function GET(request: NextRequest) {
  const auth = await requireAdminApiSession(request, false);
  if (!auth.ok) return auth.response;

  const db = getAdminDb();
  const { data, error } = await db.from("country_launch_controls").select("country_code,country_name,region_code,launch_state,reason,updated_by,updated_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const overrides = new Map((data ?? []).map((row) => [row.country_code, row]));
  const countries = canonicalCountries().map((country) => {
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
  return NextResponse.json({ countries });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdminApiSession(request, true);
  if (!auth.ok) return auth.response;

  const body = (await request.json()) as { countryCode?: string; launchState?: RegionLaunchState; reason?: string };
  const countryCode = body.countryCode?.trim().toUpperCase();
  const launchState = body.launchState as RegionLaunchState;
  const allowed: RegionLaunchState[] = ["ACTIVE", "PRIVATE", "BETA", "DISABLED"];
  if (!countryCode || !allowed.includes(launchState)) {
    return NextResponse.json({ error: "Valid countryCode and launchState are required." }, { status: 400 });
  }
  const canonical = canonicalCountries().find((country) => country.countryCode === countryCode);
  if (!canonical) return NextResponse.json({ error: "Country is not in the canonical regional registry." }, { status: 404 });

  // Activation is fail-closed. A future country cannot become commercially
  // reachable merely because an administrator changes a database flag.
  // ACTIVE/BETA requires approved pricing plus a live, correctly identified
  // independent segment runtime. PRIVATE/DISABLED always remain available as
  // emergency isolation controls even when dependencies are unhealthy.
  if (launchState === "ACTIVE" || launchState === "BETA") {
    const readiness = await getRegionalActivationReadiness(countryCode);
    if (!readiness.ok) {
      return NextResponse.json(
        { error: "Country activation blocked by regional isolation readiness.", readiness },
        { status: 409 },
      );
    }
  }

  const db = getAdminDb();
  const { error } = await db.from("country_launch_controls").upsert({
    country_code: countryCode,
    country_name: canonical.countryName,
    region_code: canonical.regionCode,
    launch_state: launchState,
    reason: body.reason?.trim() || null,
    updated_by: auth.session.email,
    updated_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, countryCode, launchState });
}
