import { createHmac, createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
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

const FALLBACK_ADMIN_EMAIL = "1psiteon1962@gmail.com";
const FALLBACK_ADMIN_PASSWORD = "Jennifer1990$";
const FALLBACK_OWNER_EMAIL = "wcabanlienguys@gmail.com";
const FALLBACK_OWNER_PASSWORD = "Grandma1910$";
const FALLBACK_SESSION_SECRET = "Emilio2015$";

function normalizeEmail(value: string | undefined | null) {
  return value?.trim().toLowerCase() ?? "";
}

function expandFallbackSessionSecret(secret: string) {
  return createHash("sha256").update(`edunancial:${secret}`).digest("base64url");
}

function getSessionSecretConfig() {
  const configuredSecret = process.env.EDUNANCIAL_ADMIN_SESSION_SECRET?.trim();
  if (configuredSecret && configuredSecret.length >= 32) {
    return { secret: configuredSecret, usingFallback: false as const };
  }

  return {
    secret: expandFallbackSessionSecret(FALLBACK_SESSION_SECRET),
    usingFallback: true as const,
  };
}

function getSecret() {
  return getSessionSecretConfig().secret;
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

function getCredentialConfig(targetRole: AdminRole) {
  const fallbackEmail = targetRole === "owner" ? FALLBACK_OWNER_EMAIL : FALLBACK_ADMIN_EMAIL;
  const fallbackPassword = targetRole === "owner" ? FALLBACK_OWNER_PASSWORD : FALLBACK_ADMIN_PASSWORD;
  const envEmail = targetRole === "owner"
    ? process.env.EDUNANCIAL_OWNER_EMAIL
    : process.env.EDUNANCIAL_ADMIN_EMAIL;
  const envHash = targetRole === "owner"
    ? process.env.EDUNANCIAL_OWNER_PASSWORD_HASH
    : process.env.EDUNANCIAL_ADMIN_PASSWORD_HASH;

  const normalizedEnvEmail = normalizeEmail(envEmail);
  const envHashValid = typeof envHash === "string" && envHash.startsWith("scrypt$") && envHash.split("$").length === 3;
  const envValid = Boolean(normalizedEnvEmail) && envHashValid;

  return {
    email: envValid ? normalizedEnvEmail : normalizeEmail(fallbackEmail),
    passwordHash: envValid ? envHash! : hashAdminPassword(fallbackPassword),
    usingFallback: !envValid,
  };
}

async function logLoginFailure(actor: string, metadata: Record<string, unknown>) {
  await appendGlobalAuditEvent({
    id: createId("audit"),
    timestamp: new Date().toISOString(),
    action: "login-failure",
    result: "failure",
    actor: actor || "unknown",
    metadata,
  });
}

async function logLoginSuccess(actor: string, role: AdminRole, usingFallback: boolean) {
  await appendGlobalAuditEvent({
    id: createId("audit"),
    timestamp: new Date().toISOString(),
    action: "login-success",
    result: "success",
    actor,
    metadata: { role, usingFallback },
  });
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
    await logLoginFailure(email || "unknown", { reason: "rate-limited", targetRole });
    return NextResponse.json({ error: "Too many login attempts" }, { status: 429 });
  }

  const normalizedEmail = normalizeEmail(email);
  const credentialConfig = getCredentialConfig(targetRole);
  const configuredEmailBuffer = Buffer.from(credentialConfig.email);
  const normalizedEmailBuffer = Buffer.from(normalizedEmail);
  const emailMatches =
    configuredEmailBuffer.length === normalizedEmailBuffer.length &&
    timingSafeEqual(normalizedEmailBuffer, configuredEmailBuffer);
  const passwordMatches = verifyAdminPassword(password, credentialConfig.passwordHash);

  if (!emailMatches || !passwordMatches) {
    await logLoginFailure(normalizedEmail || "unknown", {
      reason: "invalid-credentials",
      targetRole,
      usingFallback: credentialConfig.usingFallback,
    });
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await createAdminSession(normalizedEmail, targetRole);
  await logLoginSuccess(normalizedEmail, targetRole, credentialConfig.usingFallback);
  return NextResponse.json({ ok: true, email: normalizedEmail, role: targetRole });
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
