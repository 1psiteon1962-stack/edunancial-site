import { randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const MEMBER_CSRF_COOKIE = "edunancial_member_csrf";

function normalizeToken(value: string | undefined): string {
  return (value ?? "").trim();
}

export function createCsrfToken(): string {
  return randomBytes(24).toString("base64url");
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) {
    return false;
  }

  try {
    const parsed = new URL(origin);
    return parsed.host === host;
  } catch {
    return false;
  }
}

export async function ensureMemberCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = normalizeToken(cookieStore.get(MEMBER_CSRF_COOKIE)?.value);
  if (existing) {
    return existing;
  }

  const token = createCsrfToken();
  cookieStore.set(MEMBER_CSRF_COOKIE, token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  return token;
}

export async function validateMemberCsrf(request: Request): Promise<boolean> {
  if (!sameOrigin(request)) {
    return false;
  }

  const cookieStore = await cookies();
  const cookieToken = normalizeToken(cookieStore.get(MEMBER_CSRF_COOKIE)?.value);
  const headerToken = normalizeToken(request.headers.get("x-csrf-token") ?? undefined);
  if (!cookieToken || !headerToken) {
    return false;
  }

  const cookieBuffer = Buffer.from(cookieToken);
  const headerBuffer = Buffer.from(headerToken);
  return cookieBuffer.length === headerBuffer.length
    && timingSafeEqual(cookieBuffer, headerBuffer);
}
