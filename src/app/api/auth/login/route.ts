import { NextResponse } from "next/server";
import { logAuthEvent } from "@/lib/auth/audit";
import { getClientIp } from "@/lib/auth/http";
import { verifyPassword } from "@/lib/auth/password";
import { enforceRateLimit } from "@/lib/auth/rateLimit";
import {
  createSessionToken,
  issueCsrfToken,
  setCsrfCookie,
  setSessionCookie,
  validateCsrf,
} from "@/lib/auth/session";
import { getUserByEmail } from "@/lib/auth/userStore";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const ip = getClientIp(request);

  if (!validateCsrf(request)) {
    return NextResponse.json(
      { success: false, error: "Invalid CSRF token." },
      { status: 403 }
    );
  }

  const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  const rate = enforceRateLimit(`login:${ip}:${email}`, {
    limit: 10,
    windowMs: 10 * 60 * 1000,
  });

  if (!rate.allowed) {
    logAuthEvent({
      action: "login",
      success: false,
      email,
      ip,
      metadata: {
        reason: "rate_limit",
      },
    });

    return NextResponse.json(
      { success: false, error: "Too many login attempts." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSeconds),
        },
      }
    );
  }

  const user = getUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    logAuthEvent({
      action: "login",
      success: false,
      email,
      ip,
      metadata: {
        reason: "invalid_credentials",
      },
    });

    return NextResponse.json(
      { success: false, error: "Invalid email or password." },
      { status: 401 }
    );
  }

  if (!user.emailVerified) {
    logAuthEvent({
      action: "login",
      success: false,
      userId: user.id,
      email,
      ip,
      metadata: {
        reason: "email_not_verified",
      },
    });

    return NextResponse.json(
      { success: false, error: "Email verification is required." },
      { status: 403 }
    );
  }

  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  logAuthEvent({
    action: "login",
    success: true,
    userId: user.id,
    email,
    ip,
  });

  const response = NextResponse.json({
    success: true,
    role: user.role,
  });

  setSessionCookie(response, token);
  setCsrfCookie(response, issueCsrfToken());
  return response;
}
