import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  verifyMemberCredentials,
  findMemberByEmail,
  recordAuditEvent,
} from "@/lib/auth/memberService";
import { loginRateLimit } from "@/lib/auth/rateLimiter";

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 *
 * Validates credentials server-side using bcrypt.
 * Issues an HttpOnly session cookie on success.
 * Returns generic error messages to prevent account enumeration.
 * Rate-limits by IP address.
 */
export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const limit = loginRateLimit(ip);
  if (!limit.allowed) {
    await recordAuditEvent("login.rate_limited", {
      actor: "unknown",
      ipAddress: ip,
    });
    return NextResponse.json(
      { success: false, error: "Too many login attempts. Please wait before trying again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const { email, password } = body as Record<string, string>;

  if (!email || !password) {
    return NextResponse.json(
      { success: false, error: "Email and password are required." },
      { status: 400 },
    );
  }

  const result = await verifyMemberCredentials(email, password);

  if (!result.success || !result.member) {
    await recordAuditEvent("login.failed", {
      actor: email,
      ipAddress: ip,
      metadata: { reason: "invalid_credentials" },
    });
    return NextResponse.json(
      { success: false, error: result.error ?? "Invalid email or password." },
      { status: 401 },
    );
  }

  const member = result.member;

  // Beta access: check server-side beta invitation for this member
  let effectiveTier = member.membershipTier;
  const betaAccess = await getServerBetaAccess(member.email);
  if (betaAccess) {
    effectiveTier = "beta";
  }

  const session = await getSession();
  session.isLoggedIn = true;
  session.memberId = member.id;
  session.email = member.email;
  session.role = member.role;
  session.membershipTier = effectiveTier;
  session.emailVerified = member.emailVerified;
  await session.save();

  await recordAuditEvent("login.success", {
    actor: member.email,
    memberId: member.id,
    ipAddress: ip,
  });

  return NextResponse.json({
    success: true,
    user: {
      id: member.id,
      email: member.email,
      firstName: member.firstName,
      lastName: member.lastName,
      country: member.country,
      phone: member.phone,
      biography: member.biography,
      preferredLanguage: member.preferredLanguage,
      preferredCurrency: member.preferredCurrency,
      role: member.role,
      membershipTier: effectiveTier,
      membershipStatus: member.membershipStatus,
      emailVerified: member.emailVerified,
      accountStatus: member.accountStatus,
      joinedDate: member.joinedDate,
      lastLoginAt: member.lastLoginAt,
      betaAccess: betaAccess,
    },
  });
}

async function getServerBetaAccess(email: string) {
  try {
    const { isSupabaseConfigured, getSupabaseAdmin } = await import("@/lib/db/supabase");
    if (!isSupabaseConfigured()) return null;

    const db = getSupabaseAdmin();
    const normalized = email.trim().toLowerCase();

    const { data } = await db
      .from("beta_invitations")
      .select("id, status, beta_starts_at, beta_expires_at, redeemed_at, first_login_at")
      .eq("approved_email_normalized", normalized)
      .eq("status", "active")
      .single();

    if (!data) return null;

    const row = data as Record<string, unknown>;
    const now = Date.now();
    const expiresAt = row.beta_expires_at ? new Date(row.beta_expires_at as string).getTime() : 0;

    if (expiresAt && expiresAt < now) return null;

    return {
      invitationId: row.id as string,
      status: "active" as const,
      betaStartsAt: row.beta_starts_at as string | null,
      betaExpiresAt: row.beta_expires_at as string | null,
      remainingMs: expiresAt ? Math.max(0, expiresAt - now) : 0,
    };
  } catch {
    return null;
  }
}
