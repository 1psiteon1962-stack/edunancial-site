import { NextRequest, NextResponse } from "next/server";
import { verifyEmailToken, recordAuditEvent } from "@/lib/auth/memberService";
import { getSession } from "@/lib/auth/session";
import { verifyEmailRateLimit } from "@/lib/auth/rateLimiter";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/verify-email
 *
 * Verifies the email verification token sent during registration.
 * Token is single-use and expires after 24 hours.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const limit = verifyEmailRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many verification attempts. Please try again later." },
      { status: 429 },
    );
  }

  let token: string;
  try {
    const body = await request.json();
    token = body.token as string;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!token || typeof token !== "string") {
    return NextResponse.json({ success: false, error: "Token is required." }, { status: 400 });
  }

  const result = await verifyEmailToken(token);

  if (!result.success) {
    await recordAuditEvent("email_verification.failed", {
      ipAddress: ip,
      metadata: { reason: result.error },
    });
    return NextResponse.json(
      { success: false, error: result.error },
      { status: 400 },
    );
  }

  // Update the session to reflect email verification
  const session = await getSession();
  if (session.isLoggedIn && session.memberId === result.memberId) {
    session.emailVerified = true;
    await session.save();
  }

  await recordAuditEvent("email_verification.success", {
    memberId: result.memberId,
    ipAddress: ip,
  });

  return NextResponse.json({ success: true });
}
