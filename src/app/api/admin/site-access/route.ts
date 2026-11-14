import { NextResponse } from "next/server";

import { requireAdminApiSession, requireOwnerApiSession } from "@/lib/admin-content/auth";
import { DEFAULT_BLOCKED, isKnownLocation, type SiteAccessState } from "@/lib/regions/site-access-policy";
import { buildSiteAccessRows, readSiteAccessOverrides, setSiteAccess } from "@/lib/regions/site-access-store";

export const dynamic = "force-dynamic";

/** List every country/region and whether visitors from it may enter the site. */
export async function GET(request: Request) {
  const auth = await requireAdminApiSession(request);
  if (!auth.ok) return auth.response;
  try {
    const rows = buildSiteAccessRows(await readSiteAccessOverrides());
    return NextResponse.json({ locations: rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to read site access controls." }, { status: 500 });
  }
}

/**
 * Open or block a location. Owner only. Opening a location that is blocked by
 * default for U.S. sanctions requires typing the confirmation phrase.
 */
export async function POST(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;

  const body = (await request.json().catch(() => ({}))) as { code?: unknown; state?: unknown; reason?: unknown; confirm?: unknown };
  const code = String(body.code ?? "").trim().toUpperCase();
  const state = body.state as SiteAccessState;
  if (!isKnownLocation(code) || (state !== "OPEN" && state !== "BLOCKED")) {
    return NextResponse.json({ error: "A known location code and a state of OPEN or BLOCKED are required." }, { status: 400 });
  }
  const reason = typeof body.reason === "string" && body.reason.trim() ? body.reason.trim().slice(0, 500) : null;

  if (state === "OPEN" && code in DEFAULT_BLOCKED) {
    if (String(body.confirm ?? "").trim().toUpperCase() !== `OPEN ${code}`) {
      return NextResponse.json(
        { error: `This location is blocked for U.S. sanctions. To open it, type OPEN ${code} to confirm.`, sanctionsNote: DEFAULT_BLOCKED[code] },
        { status: 409 },
      );
    }
    if (!reason) {
      return NextResponse.json({ error: "Record the reason (for example, the U.S. policy change) before opening a sanctioned location." }, { status: 400 });
    }
  }

  try {
    const result = await setSiteAccess(code, state, reason, auth.session.email);
    return NextResponse.json({ ok: true, ...result, takesEffectWithinSeconds: 60 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to save site access control." }, { status: 500 });
  }
}
