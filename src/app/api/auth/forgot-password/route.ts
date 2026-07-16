import { NextRequest, NextResponse } from "next/server";
import {
  createPasswordResetToken,
  findMemberByEmail,
  recordAuditEvent,
} from "@/lib/auth/memberService";
import { sendEmail, buildPasswordResetEmail } from "@/lib/email";
import { forgotPasswordRateLimit } from "@/lib/auth/rateLimiter";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/forgot-password
 *
 * Sends a password reset email if the account exists.
 * Always returns a 200 with a generic message to prevent account enumeration.
 * Rate-limited by IP address.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const limit = forgotPasswordRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let email: string;
  try {
    const body = await request.json();
    email = body.email as string;
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Valid email is required." }, { status: 400 });
  }

  // Always return the same success response regardless of whether the account exists
  const GENERIC_RESPONSE = {
    success: true,
    message: "If an account with that email exists, a reset link has been sent.",
  };

  const token = await createPasswordResetToken(email);

  if (token) {
    const member = await findMemberByEmail(email);
    if (member) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.edunancial.com";
      const resetUrl = siteUrl + "/reset-password?token=" + token;

      const emailMsg = buildPasswordResetEmail({
        firstName: member.firstName,
        to: member.email,
        resetUrl,
      });

      await sendEmail(emailMsg);

      await recordAuditEvent("password_reset.requested", {
        actor: member.email,
        memberId: member.id,
        ipAddress: ip,
      });
    }
  } else {
    // No account found — record attempt but return generic response
    await recordAuditEvent("password_reset.no_account", {
      actor: email,
      ipAddress: ip,
    });
  }

  return NextResponse.json(GENERIC_RESPONSE);
}
