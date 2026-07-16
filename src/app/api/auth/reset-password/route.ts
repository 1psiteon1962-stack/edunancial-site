import { NextRequest, NextResponse } from "next/server";
import {
  consumePasswordResetToken,
  recordAuditEvent,
} from "@/lib/auth/memberService";
import { getSession } from "@/lib/auth/session";
import { validatePassword } from "@/lib/authContext";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/reset-password
 *
 * Consumes a single-use password reset token and sets a new password.
 * Invalidates the current session to force re-authentication.
 * Token expires after 1 hour and cannot be reused.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { token, password } = body as Record<string, string>;

  if (!token || !password) {
    return NextResponse.json(
      { success: false, error: "Token and new password are required." },
      { status: 400 },
    );
  }

  // Enforce password policy
  const policyErrors = validatePassword(password);
  if (policyErrors.length > 0) {
    return NextResponse.json(
      { success: false, error: policyErrors.join(". ") },
      { status: 400 },
    );
  }

  const result = await consumePasswordResetToken(token, password);

  if (!result.success) {
    await recordAuditEvent("password_reset.failed", {
      ipAddress: ip,
      metadata: { reason: result.error },
    });
    return NextResponse.json(
      { success: false, error: result.error ?? "Password reset failed." },
      { status: 400 },
    );
  }

  // Invalidate the current session to force re-authentication after password reset
  const session = await getSession();
  session.destroy();

  await recordAuditEvent("password_reset.success", {
    memberId: result.memberId,
    ipAddress: ip,
  });

  return NextResponse.json({ success: true });
}
