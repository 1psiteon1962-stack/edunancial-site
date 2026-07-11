import { NextResponse } from "next/server";
import { logAuthEvent } from "@/lib/auth/audit";
import { getClientIp } from "@/lib/auth/http";
import { verifyOneTimeToken } from "@/lib/auth/password";
import {
  createSessionToken,
  issueCsrfToken,
  setCsrfCookie,
  setSessionCookie,
} from "@/lib/auth/session";
import {
  findUserByVerificationToken,
  updateUser,
} from "@/lib/auth/userStore";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const ip = getClientIp(request);
  const { searchParams } = new URL(request.url);
  const token = (searchParams.get("token") ?? "").trim();

  if (!token) {
    return NextResponse.redirect(new URL("/verify-email?error=missing_token", request.url));
  }

  const user = findUserByVerificationToken(token);

  if (!user || !user.verificationTokenHash || !verifyOneTimeToken(token, user.verificationTokenHash)) {
    logAuthEvent({
      action: "verify-email",
      success: false,
      ip,
      metadata: { reason: "invalid_or_expired_token" },
    });

    return NextResponse.redirect(new URL("/verify-email?error=invalid_token", request.url));
  }

  updateUser(user.email, {
    emailVerified: true,
    verificationTokenHash: null,
    verificationTokenExpiresAt: null,
  });

  logAuthEvent({
    action: "verify-email",
    success: true,
    userId: user.id,
    email: user.email,
    ip,
  });

  // Issue a session so the user is logged in immediately after verifying.
  const sessionToken = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  const csrfToken = issueCsrfToken();
  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  setSessionCookie(response, sessionToken);
  setCsrfCookie(response, csrfToken);
  return response;
}
