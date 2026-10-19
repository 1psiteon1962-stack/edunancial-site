import { NextResponse } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const auth = await requireOwnerApiSession(request);
  if (!auth.ok) return auth.response;
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from("beta_access_grants").select("id,user_id,email,status,access_tier,issued_at,first_used_at,expires_at,reissue_count,generation,notes").order("issued_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ grants: data ?? [] });
}

const LEGACY_ISSUANCE_RETIRED = "Legacy beta accounts can no longer be created or reissued. Use single-use beta codes (Admin > Beta Tester Management).";

// Retired: this path created Supabase users and grants outside the Neon beta-code system.
export async function POST(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  return NextResponse.json({ error: LEGACY_ISSUANCE_RETIRED }, { status: 410 });
}

export async function PATCH(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => ({})) as { userId?: string; action?: "reissue" | "revoke" };
  if (!body.userId || !body.action) return NextResponse.json({ error: "userId and action are required." }, { status: 400 });
  const admin = getSupabaseAdminClient();

  if (body.action === "revoke") {
    const { error } = await admin.from("beta_access_grants").update({ status: "revoked", revoked_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("user_id", body.userId);
    return error ? NextResponse.json({ error: error.message }, { status: 400 }) : NextResponse.json({ ok: true });
  }

  // Reissue is retired; revocation above stays available because it only reduces access.
  return NextResponse.json({ error: LEGACY_ISSUANCE_RETIRED }, { status: 410 });
}
