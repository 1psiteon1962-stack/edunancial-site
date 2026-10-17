import { NextResponse } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { BETA_CODE_DURATION_DAYS, BETA_CODE_MAX_BATCH, getBetaCodePepper, issueBetaCodes } from "@/lib/member/beta-codes";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** Owner-only list. Never returns plaintext codes or hashes. */
export async function GET(request: Request) {
  const auth = await requireOwnerApiSession(request);
  if (!auth.ok) return auth.response;
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("beta_access_codes")
    .select("id,code_hint,batch_label,entitlement_type,duration_days,status,issued_at,issued_by,redeemed_by_user_id,redeemed_at,expires_at,revoked_at")
    .order("issued_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE });
  const codes = data ?? [];
  const now = Date.now();
  const summary = {
    issued: codes.length,
    unredeemed: codes.filter((c) => c.status === "issued").length,
    activeRedeemed: codes.filter((c) => c.status === "redeemed" && c.expires_at && new Date(c.expires_at).getTime() > now).length,
    expired: codes.filter((c) => c.status === "redeemed" && c.expires_at && new Date(c.expires_at).getTime() <= now).length,
    revoked: codes.filter((c) => c.status === "revoked").length,
  };
  return NextResponse.json({ summary, codes }, { headers: NO_STORE });
}

/** Owner-only issuance. Plaintext codes are returned exactly once in this response and never stored. */
export async function POST(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => ({})) as { count?: number; batchLabel?: string };
  const count = Number(body.count ?? 10);
  if (!Number.isInteger(count) || count < 1 || count > BETA_CODE_MAX_BATCH) {
    return NextResponse.json({ error: `count must be 1–${BETA_CODE_MAX_BATCH}.` }, { status: 400, headers: NO_STORE });
  }

  let pepper: string;
  try { pepper = getBetaCodePepper(); } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 503, headers: NO_STORE });
  }

  const issued = issueBetaCodes(count, pepper);
  const batchLabel = body.batchLabel?.trim().slice(0, 80) || `beta-${new Date().toISOString().slice(0, 10)}`;
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from("beta_access_codes")
    .insert(issued.map((code) => ({
      code_hash: code.codeHash,
      code_hint: code.codeHint,
      batch_label: batchLabel,
      duration_days: BETA_CODE_DURATION_DAYS,
      issued_by: auth.session.email,
    })))
    .select("id,code_hash");
  if (error || !data || data.length !== issued.length) {
    return NextResponse.json({ error: error?.message ?? "Codes were not persisted. No codes issued." }, { status: 500, headers: NO_STORE });
  }

  await admin.from("beta_access_audit").insert(data.map((row) => ({
    code_id: row.id, actor: auth.session.email, action: "beta.code.issued", metadata: { batchLabel },
  })));

  const byHash = new Map(issued.map((code) => [code.codeHash, code.code]));
  return NextResponse.json({
    batchLabel,
    count: data.length,
    durationDays: BETA_CODE_DURATION_DAYS,
    clockStarts: "at successful redemption",
    warning: "Copy these codes now. They are not stored and cannot be shown again.",
    codes: data.map((row) => ({ id: row.id, code: byHash.get(row.code_hash) ?? null })),
  }, { status: 201, headers: NO_STORE });
}

/** Owner-only revoke / extend. */
export async function PATCH(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => ({})) as { codeId?: string; action?: "revoke" | "extend"; days?: number };
  if (!body.codeId || !body.action) return NextResponse.json({ error: "codeId and action are required." }, { status: 400 });
  const admin = getSupabaseAdminClient();

  if (body.action === "revoke") {
    const { data, error } = await admin.rpc("revoke_beta_access_code", { p_code_id: body.codeId, p_actor: auth.session.email });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: data === "revoked" || data === "already_revoked", result: data });
  }

  const days = Number(body.days);
  if (!Number.isInteger(days) || days < 1 || days > 180) return NextResponse.json({ error: "days must be 1–180." }, { status: 400 });
  const { data, error } = await admin.rpc("extend_beta_access_code", { p_code_id: body.codeId, p_days: days, p_actor: auth.session.email });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: "Only redeemed, non-revoked codes can be extended." }, { status: 409 });
  return NextResponse.json({ ok: true, expiresAt: data });
}