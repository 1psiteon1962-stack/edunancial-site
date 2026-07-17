import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import {
  ADMIN_CSRF_COOKIE,
  ADMIN_SESSION_COOKIE,
  DEFAULT_LOGIN_RATE_LIMIT,
  DEFAULT_SESSION_MAX_AGE_SECONDS,
} from "@/lib/admin-content/config";
import { AuditEvent, type ActorContext, type AdminRole, type AdminSession } from "@/lib/admin-content/types";
import { appendGlobalAuditEvent } from "@/lib/admin-content/audit";
import { checkRateLimit, getRateLimitKey } from "@/lib/admin-content/rate-limit";
import { createCsrfToken, createId } from "@/lib/admin-content/utils";

function getSecret() {
  const secret = process.env.EDUNANCIAL_ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("EDUNANCIAL_ADMIN_SESSION_SECRET must be set to at least 32 characters");
  }
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function serializeSession(session: AdminSession) {
  const payload = Buffer.from(JSON.stringify(session)).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function parseAdminSessionValue(value: string | undefined | null): AdminSession | null {
  if (!value) return null;
  const [payload, signature] = value.split(".");
  if (!payload || !signature) return null;
  const expected = sign(payload);
  const provided = Buffer.from(signature);
  const actual = Buffer.from(expected);
  if (provided.length !== actual.length || !timingSafeEqual(provided, actual)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as AdminSession;
    if (!session.email || !session.expiresAt || !session.csrfToken) {
      return null;
    }
    if (session.expiresAt <= Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function hashAdminPassword(password: string, salt = randomBytes(16).toString("hex")) {
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyAdminPassword(password: string, storedHash: string) {
  const [algorithm, salt, digest] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !digest) {
    return false;
  }
  const candidate = scryptSync(password, salt, 64).toString("hex");
  const candidateBuffer = Buffer.from(candidate, "utf8");
  const digestBuffer = Buffer.from(digest, "utf8");
  return candidateBuffer.length === digestBuffer.length && timingSafeEqual(candidateBuffer, digestBuffer);
}

export async function createAdminSession(email: string, role: AdminRole = "admin") {
  const csrfToken = createCsrfToken();
  const maxAge = DEFAULT_SESSION_MAX_AGE_SECONDS;
  const session: AdminSession = {
    email,
    csrfToken,
    expiresAt: Date.now() + maxAge * 1000,
    role,
  };
  const serialized = serializeSession(session);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, serialized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  cookieStore.set(ADMIN_CSRF_COOKIE, csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
  return session;
}

export function createSignedSessionValue(session: AdminSession) {
  return serializeSession(session);
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, path: "/", expires: new Date(0) });
  cookieStore.set(ADMIN_CSRF_COOKIE, "", { httpOnly: false, path: "/", expires: new Date(0) });
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  return parseAdminSessionValue(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdminPageSession() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}

export async function requireAdminApiSession(request: Request, stateChanging = false) {
  const session = parseAdminSessionValue(request.headers.get("cookie")?.match(new RegExp(`${ADMIN_SESSION_COOKIE}=([^;]+)`))?.[1] ?? null);
  if (!session) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (stateChanging) {
    const csrfCookie = request.headers.get("cookie")?.match(new RegExp(`${ADMIN_CSRF_COOKIE}=([^;]+)`))?.[1] ?? "";
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

export async function requireOwnerPageSession() {
  const session = await getAdminSession();
  if (!session || session.role !== "owner") {
    redirect("/executive/login");
  }
  return session;
}

export async function requireOwnerApiSession(request: Request, stateChanging = false) {
  const result = await requireAdminApiSession(request, stateChanging);
  if (!result.ok) return result;
  if (result.session.role !== "owner") {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return result;
}


export async function validateAdminLogin(request: Request, email: string, password: string, targetRole: AdminRole = "admin") {
  const limited = checkRateLimit(
    getRateLimitKey("admin-login", request),
    DEFAULT_LOGIN_RATE_LIMIT.maxRequests,
    DEFAULT_LOGIN_RATE_LIMIT.windowMs,
  );

  if (!limited.allowed) {
    await appendGlobalAuditEvent({
      id: createId("audit"),
      timestamp: new Date().toISOString(),
      action: "login-failure",
      result: "failure",
      actor: email || "unknown",
      metadata: { reason: "rate-limited" },
    });
    return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (targetRole === "owner") {
    const ownerEmail = process.env.EDUNANCIAL_OWNER_EMAIL;
    const ownerHash = process.env.EDUNANCIAL_OWNER_PASSWORD_HASH;
    const normalizedOwnerEmail = ownerEmail?.trim().toLowerCase();
    const ownerEmailMatches =
      normalizedOwnerEmail &&
      normalizedEmail.length === normalizedOwnerEmail.length &&
      timingSafeEqual(Buffer.from(normalizedEmail), Buffer.from(normalizedOwnerEmail));
    const ownerPasswordMatches = ownerHash ? verifyAdminPassword(password, ownerHash) : false;
    if (ownerEmailMatches && ownerPasswordMatches) {
      await createAdminSession(normalizedEmail, "owner");
      await appendGlobalAuditEvent({
        id: createId("audit"),
        timestamp: new Date().toISOString(),
        action: "login-success",
        result: "success",
        actor: normalizedEmail,
        metadata: { role: "owner" },
      });
      return NextResponse.json({ ok: true, email: normalizedEmail, role: "owner" });
    }
    await appendGlobalAuditEvent({
      id: createId("audit"),
      timestamp: new Date().toISOString(),
      action: "login-failure",
      result: "failure",
      actor: normalizedEmail || "unknown",
      metadata: { reason: "invalid-credentials", targetRole },
    });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const configuredEmail = process.env.EDUNANCIAL_ADMIN_EMAIL;
  const configuredHash = process.env.EDUNANCIAL_ADMIN_PASSWORD_HASH;
  const normalizedConfiguredEmail = configuredEmail?.trim().toLowerCase();
  const emailMatches =
    normalizedConfiguredEmail &&
    normalizedEmail.length === normalizedConfiguredEmail.length &&
    timingSafeEqual(Buffer.from(normalizedEmail), Buffer.from(normalizedConfiguredEmail));
  const passwordMatches = configuredHash ? verifyAdminPassword(password, configuredHash) : false;

  if (!emailMatches || !passwordMatches) {
    await appendGlobalAuditEvent({
      id: createId("audit"),
      timestamp: new Date().toISOString(),
      action: "login-failure",
      result: "failure",
      actor: normalizedEmail || "unknown",
      metadata: { reason: "invalid-credentials" },
    });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession(normalizedEmail, "admin");
  await appendGlobalAuditEvent({
    id: createId("audit"),
    timestamp: new Date().toISOString(),
    action: "login-success",
    result: "success",
    actor: normalizedEmail,
    metadata: { role: "admin" },
  });
  return NextResponse.json({ ok: true, email: normalizedEmail, role: "admin" });
}

export function toActor(session: AdminSession): ActorContext {
  return { email: session.email };
}

export function createAuditEvent(event: Omit<AuditEvent, "id" | "timestamp">): AuditEvent {
  return {
    id: createId("audit"),
    timestamp: new Date().toISOString(),
    ...event,
  };
}
