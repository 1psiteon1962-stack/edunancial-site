import { NextResponse } from "next/server";
import { logAuthEvent } from "@/lib/auth/audit";
import { getClientIp } from "@/lib/auth/http";
import { hashOneTimeToken } from "@/lib/auth/password";
import { enforceRateLimit } from "@/lib/auth/rateLimit";
import { getUserByEmail, updateUser } from "@/lib/auth/userStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = enforceRateLimit(`forgot-password:${ip}`, {
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many requests." },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  const body = (await request.json()) as { email?: string };
  const email = (body.email ?? "").trim().toLowerCase();

  if (!email) {
    return NextResponse.json(
      { success: false, error: "Email is required." },
      { status: 400 }
    );
  }

  // Always respond 200 to avoid user enumeration.
  const user = getUserByEmail(email);

  if (user) {
    const resetToken = crypto.randomUUID();
    updateUser(email, {
      resetTokenHash: hashOneTimeToken(resetToken),
      resetTokenExpiresAt: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    logAuthEvent({
      action: "forgot-password",
      success: true,
      userId: user.id,
      email,
      ip,
    });

    // In development, expose the token so it can be tested without email.
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json({ success: true, resetToken });
    }
  }

  return NextResponse.json({
    success: true,
    message: "If that email is registered you will receive a reset link.",
  });
}
