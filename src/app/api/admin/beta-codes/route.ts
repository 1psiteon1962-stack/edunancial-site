import { NextResponse } from "next/server";

import { requireOwnerApiSession } from "@/lib/admin-content/auth";
import { getNeonSql } from "@/lib/db/neon";
import {
  BETA_MAX_BATCH,
  extendBetaCode,
  getBetaCodeSummary,
  issueBetaCodeBatch,
  listBetaCodes,
  revokeBetaCode,
  storeBetaCodeHashes,
  type SqlClient,
} from "@/lib/member/neon-beta-codes";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const db = () => getNeonSql() as unknown as SqlClient | null;
const unavailable = () => NextResponse.json({ error: "Neon database is not configured for this deploy." }, { status: 503, headers: NO_STORE });

/** Owner-only: counts and a code list. Never returns plaintext codes, hashes or account ids. */
export async function GET(request: Request) {
  const auth = await requireOwnerApiSession(request);
  if (!auth.ok) return auth.response;
  const sql = db();
  if (!sql) return unavailable();
  const [summary, codes] = await Promise.all([getBetaCodeSummary(sql), listBetaCodes(sql)]);
  return NextResponse.json({ summary, codes }, { headers: NO_STORE });
}

/** Owner-only issuance. Plaintext codes are returned exactly once, here, and never stored. */
export async function POST(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => ({})) as { count?: unknown };
  const count = Number(body.count ?? 10);
  if (!Number.isInteger(count) || count < 1 || count > BETA_MAX_BATCH) {
    return NextResponse.json({ error: `count must be 1–${BETA_MAX_BATCH}.` }, { status: 400, headers: NO_STORE });
  }
  const sql = db();
  if (!sql) return unavailable();
  const batch = issueBetaCodeBatch(count);
  try {
    await storeBetaCodeHashes(sql, batch.map((b) => b.codeHash));
  } catch (error) {
    // All-or-nothing insert: on any failure no code was stored, so none is shown.
    return NextResponse.json({ error: `Codes were not persisted: ${error instanceof Error ? error.message : String(error)}` }, { status: 500, headers: NO_STORE });
  }
  const summary = await getBetaCodeSummary(sql);
  return NextResponse.json({
    count: batch.length,
    durationDays: 90,
    clockStarts: "at successful redemption",
    warning: "Copy these codes now. Only their hashes are stored; they cannot be shown again.",
    codes: batch.map((b) => b.code),
    summary,
  }, { status: 201, headers: NO_STORE });
}

/** Owner-only revoke / extend. */
export async function PATCH(request: Request) {
  const auth = await requireOwnerApiSession(request, true);
  if (!auth.ok) return auth.response;
  const body = await request.json().catch(() => ({})) as { codeId?: unknown; action?: unknown; days?: unknown };
  const codeId = Number(body.codeId);
  if (!Number.isInteger(codeId) || codeId < 1 || (body.action !== "revoke" && body.action !== "extend")) {
    return NextResponse.json({ error: "codeId and action (revoke | extend) are required." }, { status: 400, headers: NO_STORE });
  }
  const sql = db();
  if (!sql) return unavailable();
  if (body.action === "revoke") {
    const ok = await revokeBetaCode(sql, codeId);
    return NextResponse.json(ok ? { ok: true } : { error: "Code not found or already revoked." }, { status: ok ? 200 : 409, headers: NO_STORE });
  }
  const days = Number(body.days);
  if (!Number.isInteger(days) || days < 1 || days > 180) return NextResponse.json({ error: "days must be 1–180." }, { status: 400, headers: NO_STORE });
  const expiresAt = await extendBetaCode(sql, codeId, days);
  return NextResponse.json(expiresAt ? { ok: true, expiresAt } : { error: "Only redeemed, non-revoked codes can be extended." }, { status: expiresAt ? 200 : 409, headers: NO_STORE });
}
