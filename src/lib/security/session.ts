import { GlobalRolePermissions, type GlobalRole, hasGlobalPermission, type GlobalPermission } from "@/lib/globalPermissions";

export const SESSION_COOKIE_NAME = "edunancial_session";

export type SecuritySession = {
  email: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  permissions: GlobalPermission[];
  role: GlobalRole;
  sessionId: string | null;
  userId: string | null;
};

type SessionPayload = {
  email?: string | null;
  expiresAt?: string | null;
  role?: string | null;
  sessionId?: string | null;
  userId?: string | null;
};

const DEFAULT_ROLE: GlobalRole = "guest";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const normalized = padded + "=".repeat((4 - (padded.length % 4 || 4)) % 4);
  return atob(normalized);
}

function isGlobalRole(value: string): value is GlobalRole {
  return value in GlobalRolePermissions;
}

function createDefaultSession(): SecuritySession {
  return {
    email: null,
    expiresAt: null,
    isAuthenticated: false,
    permissions: GlobalRolePermissions[DEFAULT_ROLE],
    role: DEFAULT_ROLE,
    sessionId: null,
    userId: null,
  };
}

async function signValue(value: string): Promise<string | null> {
  const secret = process.env.EDUNANCIAL_SESSION_SECRET;

  if (!secret) {
    return null;
  }

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(value)
  );

  return toBase64Url(String.fromCharCode(...new Uint8Array(signature)));
}

async function verifySignedValue(value: string, signature: string): Promise<boolean> {
  const expected = await signValue(value);
  return Boolean(expected && expected === signature);
}

function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) {
      return rawValue.join("=") || null;
    }
  }

  return null;
}

function normalizePayload(payload: SessionPayload): SecuritySession {
  const role = payload.role && isGlobalRole(payload.role) ? payload.role : DEFAULT_ROLE;

  return {
    email: typeof payload.email === "string" ? payload.email : null,
    expiresAt: typeof payload.expiresAt === "string" ? payload.expiresAt : null,
    isAuthenticated: Boolean(payload.userId),
    permissions: GlobalRolePermissions[role],
    role,
    sessionId: typeof payload.sessionId === "string" ? payload.sessionId : null,
    userId: typeof payload.userId === "string" ? payload.userId : null,
  };
}

async function parseSignedSession(token: string): Promise<SecuritySession | null> {
  const [payloadPart, signaturePart] = token.split(".");

  if (!payloadPart || !signaturePart) {
    return null;
  }

  if (!(await verifySignedValue(payloadPart, signaturePart))) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(payloadPart)) as SessionPayload;
    return normalizePayload(payload);
  } catch {
    return null;
  }
}

export async function createSignedSessionToken(
  payload: Required<Pick<SessionPayload, "role" | "userId">> &
    Omit<SessionPayload, "role" | "userId">
): Promise<string> {
  const encodedPayload = toBase64Url(
    JSON.stringify({
      ...payload,
      expiresAt:
        payload.expiresAt ??
        new Date(Date.now() + SESSION_MAX_AGE_SECONDS * 1000).toISOString(),
    })
  );
  const signature = await signValue(encodedPayload);

  if (!signature) {
    throw new Error("EDUNANCIAL_SESSION_SECRET is required to create a session token.");
  }

  return `${encodedPayload}.${signature}`;
}

export async function getSecuritySessionFromRequest(
  request: Pick<Request, "headers">
): Promise<SecuritySession> {
  const headerRole = request.headers.get("x-auth-role");
  const headerUserId = request.headers.get("x-auth-user-id");

  if (headerRole && headerUserId && isGlobalRole(headerRole)) {
    return normalizePayload({
      email: request.headers.get("x-auth-email"),
      expiresAt: request.headers.get("x-auth-expires-at"),
      role: headerRole,
      sessionId: request.headers.get("x-auth-session-id"),
      userId: headerUserId,
    });
  }

  const cookieHeader = request.headers.get("cookie");
  const sessionToken = getCookieValue(cookieHeader, SESSION_COOKIE_NAME);

  if (!sessionToken) {
    return createDefaultSession();
  }

  const session = await parseSignedSession(sessionToken);

  if (!session) {
    return createDefaultSession();
  }

  if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
    return createDefaultSession();
  }

  return session;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function hasSessionPermission(
  session: SecuritySession,
  permission: GlobalPermission
): boolean {
  return hasGlobalPermission(session.role, permission);
}

export function hasAnyAdminAccess(session: SecuritySession): boolean {
  return session.role !== "guest" && session.role !== "visitor" && session.permissions.length > 0;
}
