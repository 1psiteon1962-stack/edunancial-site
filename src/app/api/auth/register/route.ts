import { NextResponse } from "next/server";
import { logAuthEvent } from "@/lib/auth/audit";
import { getClientIp } from "@/lib/auth/http";
import { hashPassword, hashOneTimeToken, validatePassword } from "@/lib/auth/password";
import { enforceRateLimit } from "@/lib/auth/rateLimit";
import { issueCsrfToken, setCsrfCookie, validateCsrf } from "@/lib/auth/session";
import { createUser, getUserByEmail, updateUser } from "@/lib/auth/userStore";

export const runtime = "nodejs";

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function isValidEmail(value: string): boolean {
  // Split-based validation avoids ReDoS on unbounded repetition patterns.
  const atIndex = value.indexOf("@");
  if (atIndex < 1) return false;
  if (atIndex !== value.lastIndexOf("@")) return false;

  const local = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);

  if (!local || !domain) return false;
  if (/\s/.test(local) || /\s/.test(domain)) return false;

  const dotIndex = domain.lastIndexOf(".");
  if (dotIndex < 1 || dotIndex >= domain.length - 1) return false;

  return true;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = enforceRateLimit(`register:${ip}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many registration attempts." },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSeconds),
        },
      }
    );
  }

  if (!validateCsrf(request)) {
    return NextResponse.json(
      { success: false, error: "Invalid CSRF token." },
      { status: 403 }
    );
  }

  const body = (await request.json()) as {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };

  const firstName = normalizeName(body.firstName ?? "");
  const lastName = normalizeName(body.lastName ?? "");
  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";

  if (!firstName || !lastName || !email || !password) {
    return NextResponse.json(
      { success: false, error: "Missing required registration fields." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, error: "Invalid email address." },
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

  if (getUserByEmail(email)) {
    return NextResponse.json(
      { success: false, error: "Email already registered." },
      { status: 409 }
    );
  }

  const user = createUser({
    email,
    firstName,
    lastName,
    passwordHash: hashPassword(password),
  });

  const verificationToken = crypto.randomUUID();
  updateUser(email, {
    verificationTokenHash: hashOneTimeToken(verificationToken),
    verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
  });

  logAuthEvent({
    action: "register",
    success: true,
    userId: user.id,
    email,
    ip,
  });

  const csrfToken = issueCsrfToken();
  const response = NextResponse.json({
    success: true,
    message: "Registration successful. Verify your email before logging in.",
    ...(process.env.NODE_ENV === "production"
      ? {}
      : {
          verificationToken,
        }),
  });

  setCsrfCookie(response, csrfToken);
  return response;
}
