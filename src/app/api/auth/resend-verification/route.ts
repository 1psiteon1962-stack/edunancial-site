import { NextRequest, NextResponse } from "next/server";
import {
  findMemberById,
  createEmailVerificationToken,
  recordAuditEvent,
} from "@/lib/auth/memberService";
import { sendEmail, buildVerificationEmail } from "@/lib/email";
import { getSession } from "@/lib/auth/session";
import { verifyEmailRateLimit } from "@/lib/auth/rateLimiter";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/resend-verification
 *
 * Resends the verification email for the current session member.
 * Rate-limited to prevent abuse.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  const limit = verifyEmailRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const session = await getSession();

  if (!session.isLoggedIn || !session.memberId) {
    return NextResponse.json(
      { success: false, error: "You must be signed in to resend verification." },
      { status: 401 },
    );
  }

  const member = await findMemberById(session.memberId);
  if (!member) {
    return NextResponse.json({ success: false, error: "Member not found." }, { status: 404 });
  }

  if (member.emailVerified) {
    return NextResponse.json({ success: false, error: "Your email is already verified." }, { status: 400 });
  }

  const token = await createEmailVerificationToken(member.id);
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Failed to create verification token. Please try again." },
      { status: 500 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.edunancial.com";
  const verificationUrl = siteUrl + "/verify-email?token=" + token;

  const emailMsg = buildVerificationEmail({
    firstName: member.firstName,
    to: member.email,
    verificationUrl,
  });

  await sendEmail(emailMsg);

  await recordAuditEvent("email_verification.resent", {
    actor: member.email,
    memberId: member.id,
    ipAddress: ip,
  });

  return NextResponse.json({ success: true });
}
