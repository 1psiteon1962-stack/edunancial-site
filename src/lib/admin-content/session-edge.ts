/**
 * Edge-runtime verification of the signed admin session cookie.
 *
 * Middleware runs on the Edge runtime, where `node:crypto` is unavailable, so it
 * cannot call `parseAdminSessionValue()` from `auth.ts`. This module performs the
 * same check with Web Crypto: the cookie is `${base64url(JSON)}.${base64url(sig)}`
 * where `sig = HMAC-SHA256(EDUNANCIAL_ADMIN_SESSION_SECRET, payload)`.
 *
 * A cookie is accepted only when the signature verifies against the configured
 * secret, the payload is well formed, the session has not expired and the role is
 * `admin` or `owner`. Every other case — including a missing or too-short secret —
 * is rejected (fail closed).
 */

export const MIN_ADMIN_SESSION_SECRET_LENGTH = 32;

export type AdminSessionRejection =
  | "missing"
  | "malformed"
  | "secret-unavailable"
  | "bad-signature"
  | "invalid-payload"
  | "expired"
  | "forbidden-role";

export type EdgeAdminSessionResult =
  | { valid: true; email: string; role: "admin" | "owner"; expiresAt: number }
  | { valid: false; reason: AdminSessionRejection };

const BASE64URL_SEGMENT = /^[A-Za-z0-9_-]+$/;
const encoder = new TextEncoder();
const keyCache = new Map<string, Promise<CryptoKey>>();

function getHmacKey(secret: string): Promise<CryptoKey> {
  let key = keyCache.get(secret);
  if (!key) {
    key = crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    keyCache.set(secret, key);
  }
  return key;
}

function bytesToBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToUtf8(segment: string): string {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

/** Constant-time comparison for equal-length ASCII strings. */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function signAdminSessionPayloadEdge(payload: string, secret: string): Promise<string> {
  const key = await getHmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return bytesToBase64url(new Uint8Array(signature));
}

export async function verifyAdminSessionCookie(
  value: string | undefined | null,
  secret: string | undefined | null,
  now: number = Date.now(),
): Promise<EdgeAdminSessionResult> {
  if (!value) return { valid: false, reason: "missing" };

  const parts = value.split(".");
  if (parts.length !== 2) return { valid: false, reason: "malformed" };
  const [payload, signature] = parts;
  if (!BASE64URL_SEGMENT.test(payload) || !BASE64URL_SEGMENT.test(signature)) {
    return { valid: false, reason: "malformed" };
  }

  const normalizedSecret = secret?.trim() ?? "";
  if (normalizedSecret.length < MIN_ADMIN_SESSION_SECRET_LENGTH) {
    return { valid: false, reason: "secret-unavailable" };
  }

  const expected = await signAdminSessionPayloadEdge(payload, normalizedSecret);
  if (!constantTimeEqual(expected, signature)) return { valid: false, reason: "bad-signature" };

  let session: { email?: unknown; csrfToken?: unknown; expiresAt?: unknown; role?: unknown };
  try {
    session = JSON.parse(base64urlToUtf8(payload));
  } catch {
    return { valid: false, reason: "invalid-payload" };
  }
  if (
    !session ||
    typeof session !== "object" ||
    typeof session.email !== "string" ||
    !session.email ||
    typeof session.csrfToken !== "string" ||
    !session.csrfToken ||
    typeof session.expiresAt !== "number" ||
    !Number.isFinite(session.expiresAt)
  ) {
    return { valid: false, reason: "invalid-payload" };
  }
  if (session.expiresAt <= now) return { valid: false, reason: "expired" };
  if (session.role !== "admin" && session.role !== "owner") return { valid: false, reason: "forbidden-role" };

  return { valid: true, email: session.email, role: session.role, expiresAt: session.expiresAt };
}
