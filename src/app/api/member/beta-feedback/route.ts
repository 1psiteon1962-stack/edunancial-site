import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

import { requireAuthenticatedMemberWrite } from "@/lib/auth/server";
import { saveBetaFeedback, validateBetaFeedback } from "@/lib/member/beta-feedback";

export const dynamic = "force-dynamic";
const NO_STORE = { "Cache-Control": "no-store, max-age=0" };

/** Authenticated tester feedback. The account is always the server-verified session user. */
export async function POST(request: Request) {
  const auth = await requireAuthenticatedMemberWrite(request, "beta-feedback");
  if (!auth.ok) return auth.response;
  const user = auth.session.user!;
  if (!user.betaAccess) {
    return NextResponse.json({ error: "Beta feedback is available to beta testers." }, { status: 403, headers: NO_STORE });
  }
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const result = validateBetaFeedback(body);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400, headers: NO_STORE });
  const submittedAt = new Date().toISOString();
  try {
    await saveBetaFeedback({ id: `${submittedAt.replace(/[:.]/g, "-")}-${randomUUID()}`, submittedAt, userId: user.id, email: user.email ?? null, ...result.fields });
  } catch (error) {
    console.error("[beta] feedback save failed", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Feedback could not be saved. Please try again." }, { status: 503, headers: NO_STORE });
  }
  return NextResponse.json({ ok: true, submittedAt }, { headers: NO_STORE });
}
