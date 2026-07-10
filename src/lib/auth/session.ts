import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { AuthRole } from "./roles";
import { signSessionToken, verifySessionToken, type SessionClaims } from "./token";

export const SESSION_COOKIE_NAME = "edunancial_session";
export const CSRF_COOKIE_NAME = "edunancial_csrf";

export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;
const CSRF_MAX_AGE_SECONDS = 60 * 60 * 2;

function isSecureCookie(): boolean {
  return process.env.NODE_ENV === "production";
}

export function issueCsrfToken(): string {
  return crypto.randomUUID();
}

export function setCsrfCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: CSRF_COOKIE_NAME,
    value: token,
    httpOnly: false,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: CSRF_MAX_AGE_SECONDS,
  });
}

export function validateCsrf(request: Request | NextRequest): boolean {
  const headerToken = request.headers.get("x-csrf-token");
  const cookieToken = getCookie(request, CSRF_COOKIE_NAME);

  if (!headerToken || !cookieToken) {
    return false;
  }

  return headerToken === cookieToken;
}

function parseCookies(cookieHeader: string | null): Map<string, string> {
  const map = new Map<string, string>();

  if (!cookieHeader) {
    return map;
  }

  for (const entry of cookieHeader.split(";")) {
    const [name, ...rest] = entry.trim().split("=");
    if (!name || rest.length === 0) {
      continue;
    }

    map.set(name, decodeURIComponent(rest.join("=")));
  }

  return map;
}

export function getCookie(
  request: Request | NextRequest,
  name: string
): string | undefined {
  if ("cookies" in request && typeof request.cookies.get === "function") {
    return request.cookies.get(name)?.value;
  }

  return parseCookies(request.headers.get("cookie")).get(name);
}

export async function createSessionToken(payload: {
  userId: string;
  email: string;
  role: AuthRole;
}): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const claims: SessionClaims = {
    sub: payload.userId,
    email: payload.email,
    role: payload.role,
    sid: crypto.randomUUID(),
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  };

  return signSessionToken(claims);
}

export async function readSession(
  request: Request | NextRequest
): Promise<SessionClaims | null> {
  const token = getCookie(request, SESSION_COOKIE_NAME);
  return verifySessionToken(token);
}

export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecureCookie(),
    path: "/",
    maxAge: 0,
  });
}
