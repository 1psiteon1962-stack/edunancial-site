/**
 * Server-side Curriculum Access Gate
 *
 * Determines the viewer's effective membership tier from the incoming request
 * and exposes helpers used by lesson viewer pages and API routes to enforce
 * server-side access control.
 *
 * Design note: The current implementation treats the admin session as the only
 * persisted session.  When a real user membership/auth system is added, update
 * getViewerTierFromCookies() to detect member sessions and return their tier.
 */

import { canAccessLesson, getLockedLessonMessage, getPricingTierParam, isSampleLesson, getSampleLessons, getLevelTitle, CURRICULUM_LEVEL_TITLES, type CurriculumTier } from "./tier-config";

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
 * Current logic:
 * - Valid admin session cookie → "admin"
 * - Otherwise → "free" (no membership)
 *
 * Extend this function when real user membership sessions are implemented.
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
  /** Locked lesson message when allowed === false. */
  lockedMessage?: string;
  /** Tier param for the pricing page CTA link when allowed === false. */
  pricingTierParam?: string | null;
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
  const allowed = canAccessLesson(lessonLevel, lessonNumber, viewerTier, lessonId);

  if (allowed) {
    return { allowed: true, viewerTier };
  }

  return {
    allowed: false,
    viewerTier,
    lockedMessage: getLockedLessonMessage(lessonLevel),
    pricingTierParam: getPricingTierParam(lessonLevel),
  };
}
