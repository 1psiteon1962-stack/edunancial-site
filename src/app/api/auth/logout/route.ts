import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { recordAuditEvent } from "@/lib/auth/memberService";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/logout
 *
 * Destroys the server-side session cookie.
 * No request body needed.
 */
export async function POST() {
  try {
    const session = await getSession();

    const memberId = session.memberId;
    const email = session.email;

    session.destroy();

    if (memberId) {
      await recordAuditEvent("logout", {
        actor: email ?? memberId,
        memberId,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
