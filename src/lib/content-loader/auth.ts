import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const CONTENT_LOADER_SESSION_COOKIE = "edunancial_content_loader_session";
export const CONTENT_LOADER_CSRF_COOKIE = "edunancial_content_loader_csrf";

const DEFAULT_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

export type ContentLoaderSession = {
  email: string;
  csrfToken: string;
  expiresAt: number;
};

function normalizeValue(value: string | undefined | null) {
  return value?.trim() ?? "";
}

function safeEqual(value: string, expected: string) {
  const left = Buffer.from(value);
  const right = Buffer.from(expected);
  return left.length === right.length && timingSafeEqual(left, right);
}

function getSessionSecret() {
  const configured =
    normalizeValue(process.env.EDUNANCIAL_CONTENT_LOADER_SESSION_SECRET) ||
    normalizeValue(process.env.EDUNANCIAL_ADMIN_SESSION_SECRET);
  if (configured.length >= 32) {
    return configured;
  }
  return createHash("sha256").update("edunancial-content-loader-temporary-session").digest("base64url");
}

function sign(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

function serializeSession(session: ContentLoaderSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function parseContentLoaderSessionValue(value: string | undefined | null) {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = sign(payload);
  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ContentLoaderSession;
    if (!parsed.email || !parsed.csrfToken || typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function getContentLoaderSession() {
  const cookieStore = await cookies();
  return parseContentLoaderSessionValue(cookieStore.get(CONTENT_LOADER_SESSION_COOKIE)?.value);
}

export async function createContentLoaderSession() {
  const cookieStore = await cookies();
  const csrfToken = randomBytes(24).toString("base64url");
  const email = normalizeValue(process.env.EDUNANCIAL_CONTENT_LOADER_USERNAME) || "content-loader-admin";
  const maxAge = DEFAULT_SESSION_MAX_AGE_SECONDS;
  const session: ContentLoaderSession = {
    email,
    csrfToken,
    expiresAt: Date.now() + maxAge * 1000,
  };

  cookieStore.set(CONTENT_LOADER_SESSION_COOKIE, serializeSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  cookieStore.set(CONTENT_LOADER_CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return session;
}

export async function clearContentLoaderSession() {
  const cookieStore = await cookies();
  cookieStore.set(CONTENT_LOADER_SESSION_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
  cookieStore.set(CONTENT_LOADER_CSRF_COOKIE, "", { httpOnly: false, path: "/", expires: new Date(0) });
}

function readCookieFromHeader(request: Request, cookieName: string) {
  return request.headers.get("cookie")?.match(new RegExp(`${cookieName}=([^;]+)`))?.[1] ?? "";
}

export async function validateContentLoaderPassword(password: string) {
  const configuredPassword = normalizeValue(process.env.EDUNANCIAL_CONTENT_LOADER_PASSWORD);
  if (!configuredPassword) {
    return NextResponse.json({ error: "EDUNANCIAL_CONTENT_LOADER_PASSWORD is not configured." }, { status: 500 });
  }
  if (!safeEqual(password, configuredPassword)) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const session = await createContentLoaderSession();
  return NextResponse.json({ ok: true, authenticated: true, email: session.email, csrfToken: session.csrfToken });
}

export async function requireContentLoaderApiSession(request: Request, stateChanging = false) {
  const session = parseContentLoaderSessionValue(readCookieFromHeader(request, CONTENT_LOADER_SESSION_COOKIE));
  if (!session) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  if (stateChanging) {
    const csrfCookie = readCookieFromHeader(request, CONTENT_LOADER_CSRF_COOKIE);
    const csrfHeader = request.headers.get("x-csrf-token") ?? "";
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const originMatches = !origin || !host || origin.includes(host);
    if (!originMatches || !csrfCookie || csrfCookie !== session.csrfToken || csrfHeader !== session.csrfToken) {
      return { ok: false as const, response: NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 }) };
    }
  }

  return { ok: true as const, session };
}
