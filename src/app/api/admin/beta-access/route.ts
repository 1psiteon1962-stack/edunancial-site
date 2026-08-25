import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

function temporaryPassword() {
  return `Edu!${randomBytes(12).toString("base64url")}9a`;
}

export async function GET(request: Request) {
  const auth = await requireOwnerApiSession(request);
  if (!auth.ok) return auth.response;
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from("beta_access_grants").select("id,user_id,email,status,access_tier,issued_at,first_used_at,expires_at,reissue_count,generation,notes").order("issued_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ grants: data ?? [] });
}

export async function POST(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => ({})) as { email?: string; firstName?: string; lastName?: string; notes?: string };
  const email = body.email?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: "Email is required." }, { status: 400 });

  const admin = getSupabaseAdminClient();
  const password = temporaryPassword();
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: body.firstName?.trim() ?? "Beta", last_name: body.lastName?.trim() ?? "Tester", beta_tester: true },
  });
  if (createError || !created.user) return NextResponse.json({ error: createError?.message ?? "Unable to create beta user." }, { status: 400 });

  await admin.from("user_profiles").upsert({ user_id: created.user.id, first_name: body.firstName?.trim() ?? "Beta", last_name: body.lastName?.trim() ?? "Tester", membership_tier: "free" }, { onConflict: "user_id" });
  const { error: grantError } = await admin.from("beta_access_grants").insert({ user_id: created.user.id, email, status: "issued", access_tier: "gold", created_by: auth.session.email, notes: body.notes?.slice(0, 500) ?? null });
  if (grantError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: grantError.message }, { status: 400 });
  }

  // Password is returned exactly once and is never stored in the repository or grant table.
  return NextResponse.json({ userId: created.user.id, email, temporaryPassword: password, access: "Gold-equivalent", activates: "first successful authenticated use", durationDays: 90 }, { status: 201 });
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

  const password = temporaryPassword();
  const { error: passwordError } = await admin.auth.admin.updateUserById(body.userId, { password });
  if (passwordError) return NextResponse.json({ error: passwordError.message }, { status: 400 });
  const { data, error } = await admin.from("beta_access_grants").select("reissue_count,generation").eq("user_id", body.userId).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  const { error: updateError } = await admin.from("beta_access_grants").update({ status: "issued", first_used_at: null, expires_at: null, revoked_at: null, reissue_count: (data.reissue_count ?? 0) + 1, generation: (data.generation ?? 1) + 1, issued_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("user_id", body.userId);
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });
  return NextResponse.json({ ok: true, temporaryPassword: password, activates: "next successful authenticated use", durationDays: 90 });
}
