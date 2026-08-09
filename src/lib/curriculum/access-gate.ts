/**
 * Server-side Curriculum Access Gate
 *
 * Determines the viewer's effective membership tier from the incoming request
 * and exposes helpers used by lesson viewer pages and API routes to enforce
 * server-side access control.
 *
 * Tier resolution order (highest priority wins):
 *   1. Valid admin session cookie → "admin"
 *   2. Valid member session cookie → tier from cookie ("basic" | "pro" | "gold")
 *   3. Otherwise → "free"
 *
 * The member session cookie is set by POST /api/auth/member-session (called
 * from authContext.tsx after login) and cleared on logout.
 */

import { canAccessLesson, getLockedLessonMessage, getPricingTierParam, isSampleLesson, getSampleLessons, getLevelTitle, CURRICULUM_LEVEL_TITLES, type CurriculumTier } from "./tier-config";
import { getMemberTierFromCookieHeader, isAuthenticatedFromCookieHeader } from "./member-session";

export type { CurriculumTier };
export { canAccessLesson, getLockedLessonMessage, getPricingTierParam, isSampleLesson, getSampleLessons, getLevelTitle, CURRICULUM_LEVEL_TITLES };

// ---------------------------------------------------------------------------
// Admin session detection (mirrors middleware.ts logic without HMAC verify)
// ---------------------------------------------------------------------------

const ADMIN_SESSION_COOKIE = "edunancial_admin_session";

function base64urlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4 || 4)) % 4);
  try {
    return atob(padded);
  } catch {
    throw new Error("Invalid base64url");
  }
}

function isValidAdminSession(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  const dotIdx = cookieValue.lastIndexOf(".");
  if (dotIdx < 0) return false;
  const payload = cookieValue.slice(0, dotIdx);
  try {
    const json = JSON.parse(base64urlDecode(payload)) as {
      expiresAt?: number;
      email?: string;
      csrfToken?: string;
    };
    if (!json.email || !json.csrfToken || typeof json.expiresAt !== "number") return false;
    return json.expiresAt > Date.now();
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Determines the viewer's effective membership tier from the cookie header.
 *
 * Resolution order:
 * 1. Valid admin session cookie → "admin"
 * 2. Valid member session cookie → tier from cookie
 * 3. Otherwise → "free"
 */
export function getViewerTierFromCookies(
  cookieHeader: string | null | undefined,
): CurriculumTier | "admin" {
  if (!cookieHeader) return "free";

  // Parse cookie string into a map
  const cookies: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const val = part.slice(eq + 1).trim();
    cookies[key] = val;
  }

  if (isValidAdminSession(cookies[ADMIN_SESSION_COOKIE])) {
    return "admin";
  }

  // Check member session cookie for paid/authenticated users
  const memberTier = getMemberTierFromCookieHeader(cookieHeader);
  if (memberTier !== "free") {
    return memberTier;
  }

  return "free";
}

/**
 * Result of the access gate check for a single lesson.
 */
export interface AccessGateResult {
  /** Whether the viewer may read the full lesson body. */
  allowed: boolean;
  /** The viewer's effective tier. */
  viewerTier: CurriculumTier | "admin";
  /**
   * True when the viewer has a valid member session cookie (even if free-tier).
   * Used to distinguish authenticated non-members from anonymous visitors
   * when rendering the membership gate UI.
   */
  isAuthenticated: boolean;
  /** Locked lesson message when allowed === false. */
  lockedMessage?: string;
  /** Tier param for the pricing page CTA link when allowed === false. */
  pricingTierParam?: string | null;
}

/**
 * Returns true when the lesson is in the free preview zone.
 *
 * Centralised rule (single source of truth):
 *   FREE  ↔  level === 1 && lessonNumber >= 1 && lessonNumber <= 3
 *
 * This helper is used by listing pages to show Free/Locked badges without
 * needing to perform a full access check against a viewer's session.
 */
export function isFreeLesson(level: number, lessonNumber: number): boolean {
  return level === 1 && lessonNumber >= 1 && lessonNumber <= 3;
}

/**
 * Runs the full access gate check for a lesson.
 *
 * @param lessonLevel   - The lesson's curriculum level (1–5).
 * @param lessonNumber  - The lesson's number within the level (1, 2, 3 …).
 * @param cookieHeader  - The raw Cookie header string from the request.
 * @param lessonId      - Optional lesson ID (e.g. "RED-L1-001") for Test Drive check.
 */
export function checkLessonAccess(
  lessonLevel: number,
  lessonNumber: number,
  cookieHeader: string | null | undefined,
  lessonId?: string,
): AccessGateResult {
  const viewerTier = getViewerTierFromCookies(cookieHeader);
  const isAuthenticated = viewerTier === "admin" || isAuthenticatedFromCookieHeader(cookieHeader);
  const allowed = canAccessLesson(lessonLevel, lessonNumber, viewerTier, lessonId);

  if (allowed) {
    return { allowed: true, viewerTier, isAuthenticated };
  }

  return {
    allowed: false,
    viewerTier,
    isAuthenticated,
    lockedMessage: getLockedLessonMessage(lessonLevel),
    pricingTierParam: getPricingTierParam(lessonLevel),
  };
}
