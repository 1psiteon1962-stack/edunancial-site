import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  createMember,
  createEmailVerificationToken,
  recordAuditEvent,
} from "@/lib/auth/memberService";
import { sendEmail, buildVerificationEmail } from "@/lib/email";
import { registerRateLimit } from "@/lib/auth/rateLimiter";
import { validatePassword } from "@/lib/authContext";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/register
 *
 * Creates a new member account, sends email verification, and returns session.
 * Enforces password policy, rate limiting, and duplicate prevention.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const limit = registerRateLimit(ip);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many registration attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { firstName, lastName, email, password, country } = body as Record<string, string>;

  if (!firstName || !lastName || !email || !password || !country) {
    return NextResponse.json(
      { success: false, error: "All required fields must be provided." },
      { status: 400 },
    );
  }

  if (typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Invalid email address." }, { status: 400 });
  }

  // Enforce password policy (same rules as client-side validation)
  const policyErrors = validatePassword(password);
  if (policyErrors.length > 0) {
    return NextResponse.json(
      { success: false, error: policyErrors.join(". ") },
      { status: 400 },
    );
  }

  const result = await createMember({ firstName, lastName, email, password, country });

  if (!result.success || !result.member) {
    await recordAuditEvent("register.failed", {
      actor: email,
      ipAddress: ip,
      metadata: { reason: result.error },
    });
    // Return a deliberately generic message to prevent account enumeration
    return NextResponse.json(
      {
        success: false,
        error:
          result.error ??
          "Registration failed. If you already have an account, please sign in.",
      },
      { status: 409 },
    );
  }

  const member = result.member;

  // Create and send email verification
  const verifyToken = await createEmailVerificationToken(member.id);
  if (verifyToken) {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.edunancial.com";
    const verificationUrl = siteUrl + "/verify-email?token=" + verifyToken;

    const emailMsg = buildVerificationEmail({
      firstName: member.firstName,
      to: member.email,
      verificationUrl,
    });

    await sendEmail(emailMsg);
  }

  await recordAuditEvent("register.success", {
    actor: member.email,
    memberId: member.id,
    ipAddress: ip,
  });

  // Create session immediately after registration
  const session = await getSession();
  session.isLoggedIn = true;
  session.memberId = member.id;
  session.email = member.email;
  session.role = member.role;
  session.membershipTier = member.membershipTier;
  session.emailVerified = member.emailVerified;
  await session.save();

  return NextResponse.json({
    success: true,
    user: {
      id: member.id,
      email: member.email,
      firstName: member.firstName,
      lastName: member.lastName,
      country: member.country,
      role: member.role,
      membershipTier: member.membershipTier,
      emailVerified: member.emailVerified,
      accountStatus: member.accountStatus,
      joinedDate: member.joinedDate,
    },
  });
}
