import { NextResponse } from "next/server";
import { logAuthEvent } from "@/lib/auth/audit";
import { getClientIp } from "@/lib/auth/http";
import { hashPassword, validatePassword, verifyOneTimeToken } from "@/lib/auth/password";
import { enforceRateLimit } from "@/lib/auth/rateLimit";
import {
  issueCsrfToken,
  setCsrfCookie,
} from "@/lib/auth/session";
import { findUserByResetToken, updateUser } from "@/lib/auth/userStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = enforceRateLimit(`reset-password:${ip}`, {
    limit: 10,
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

  const body = (await request.json()) as {
    token?: string;
    password?: string;
  };

  const token = (body.token ?? "").trim();
  const password = body.password ?? "";

  if (!token || !password) {
    return NextResponse.json(
      { success: false, error: "Token and new password are required." },
      { status: 400 }
    );
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json(
      { success: false, error: passwordError },
      { status: 400 }
    );
  }

  const user = findUserByResetToken(token);

  if (!user || !user.resetTokenHash || !verifyOneTimeToken(token, user.resetTokenHash)) {
    return NextResponse.json(
      { success: false, error: "Invalid or expired reset token." },
      { status: 400 }
    );
  }

  updateUser(user.email, {
    passwordHash: hashPassword(password),
    resetTokenHash: null,
    resetTokenExpiresAt: null,
  });

  logAuthEvent({
    action: "reset-password",
    success: true,
    userId: user.id,
    email: user.email,
    ip,
  });

  const csrfToken = issueCsrfToken();
  const response = NextResponse.json({
    success: true,
    message: "Password updated. You may now log in.",
  });

  setCsrfCookie(response, csrfToken);
  return response;
}
