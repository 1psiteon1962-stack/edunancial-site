/**
 * Member Session Cookie
 *
 * Provides a lightweight server-side membership session that mirrors the
 * client-side auth state (stored in localStorage by authContext.tsx) into a
 * signed, httpOnly cookie so that Next.js Server Components and API routes can
 * enforce curriculum access control without relying on client-side state.
 *
 * The cookie is set by POST /api/auth/member-session (called from authContext
 * after login) and cleared by DELETE /api/auth/member-session (on logout).
 *
 * Signing uses the same EDUNANCIAL_ADMIN_SESSION_SECRET environment variable
 * as the admin session, keyed with a "member:" prefix to ensure domain
 * separation without requiring a second secret to be provisioned.
 *
 * Auth-tier → Curriculum-tier mapping:
 *   free       → "free"
 *   basic      → "basic"   (levels 1–2 per tier-config.json)
 *   premium    → "pro"     (levels 1–4)
 *   enterprise → "gold"    (levels 1–5)
 *   beta       → "basic"   (beta testers receive basic-level access)
 */

import { createHmac } from "node:crypto";
import type { CurriculumTier } from "./tier-config";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const MEMBER_SESSION_COOKIE = "edunancial_member_session";
/** 30-day TTL — matches a typical subscription billing cycle. */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1_000;

// ---------------------------------------------------------------------------
// Auth-tier → Curriculum-tier mapping
// ---------------------------------------------------------------------------

/**
 * Maps the user-facing auth membership tier (from authContext.tsx) to the
 * canonical curriculum access tier (used by canAccessLesson in tier-config.ts).
 */
export function authTierToCurriculumTier(
  authTier: string | undefined,
): CurriculumTier {
  switch (authTier) {
    case "enterprise":
      return "gold";
    case "premium":
      return "pro";
    case "basic":
      return "basic";
    case "beta":
      return "basic";
    default:
      return "free";
  }
}

// ---------------------------------------------------------------------------
// Signing helpers
// ---------------------------------------------------------------------------

function getSigningKey(): string {
  const secret = process.env.EDUNANCIAL_ADMIN_SESSION_SECRET?.trim() ?? "";
  // Prefix to ensure member tokens are domain-separated from admin tokens.
  return `member:${secret}`;
}

function sign(payload: string): string {
  return createHmac("sha256", getSigningKey()).update(payload).digest("hex");
}

function base64urlEncode(str: string): string {
  return Buffer.from(str).toString("base64url");
}

function base64urlDecode(str: string): string {
  return Buffer.from(str, "base64url").toString("utf-8");
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface MemberSessionPayload {
  /** Curriculum access tier */
  tier: CurriculumTier;
  /** User email — stored so admin impersonation can be audited later */
  email: string;
  /** Unix timestamp (ms) when the session expires */
  expiresAt: number;
}

/**
 * Serialises a member session payload into a signed cookie value.
 *
 * Format: base64url(JSON payload) + "." + HMAC-SHA256 signature
 */
export function createMemberSessionValue(
  tier: CurriculumTier,
  email: string,
): string {
  const payload: MemberSessionPayload = {
    tier,
    email,
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
  const encoded = base64urlEncode(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

/**
 * Parses and verifies a raw member session cookie value.
 *
 * Returns null when the value is absent, malformed, tampered, or expired.
 */
export function parseMemberSessionValue(
  value: string | undefined | null,
): MemberSessionPayload | null {
  if (!value) return null;
  const dotIdx = value.lastIndexOf(".");
  if (dotIdx < 0) return null;
  const encoded = value.slice(0, dotIdx);
  const signature = value.slice(dotIdx + 1);

  // Constant-time comparison to prevent timing attacks
  const expected = sign(encoded);
  if (
    expected.length !== signature.length ||
    !timingSafeEqual(expected, signature)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(base64urlDecode(encoded)) as MemberSessionPayload;
    if (!payload.tier || !payload.email || typeof payload.expiresAt !== "number") {
      return null;
    }
    if (payload.expiresAt <= Date.now()) return null; // expired
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts the curriculum tier from a raw Cookie header string.
 * Returns "free" when no valid member session is present.
 */
export function getMemberTierFromCookieHeader(
  cookieHeader: string | null | undefined,
): CurriculumTier {
  if (!cookieHeader) return "free";

  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const val = part.slice(eq + 1).trim();
    if (key === MEMBER_SESSION_COOKIE) {
      const payload = parseMemberSessionValue(val);
      return payload?.tier ?? "free";
    }
  }
  return "free";
}

/**
 * Returns true if there is a valid (signed, non-expired) member session cookie
 * present, regardless of the tier it contains.
 *
 * Used to distinguish authenticated-but-unpaid users from anonymous visitors
 * when rendering the membership gate UI.
 */
export function isAuthenticatedFromCookieHeader(
  cookieHeader: string | null | undefined,
): boolean {
  if (!cookieHeader) return false;

  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const val = part.slice(eq + 1).trim();
    if (key === MEMBER_SESSION_COOKIE) {
      return parseMemberSessionValue(val) !== null;
    }
  }
  return false;
}

// ---------------------------------------------------------------------------
// Timing-safe string comparison (hex strings, same length guaranteed by sign())
// ---------------------------------------------------------------------------

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
