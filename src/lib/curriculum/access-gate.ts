/**
 * Server-side Curriculum Access Gate
 *
 * Determines the viewer's effective membership tier from the incoming request
 * and exposes helpers used by lesson viewer pages and API routes to enforce
 * server-side access control.
 *
 * Membership recognition:
 * - Valid admin session cookie → "admin"
 * - edunancial_member_session=1 cookie → "member" (any active membership tier)
 * - Otherwise → "free"
 *
 * Access rules (authoritative):
 * - Any track, L1 lessons 1–3 → free (public preview)
 * - Any track, L1 lesson 4+ and all of L2–L5 → requires active membership
 * - Admin → always allowed
 */

import { canAccessLesson, getLockedLessonMessage, getPricingTierParam, isSampleLesson, getSampleLessons, getLevelTitle, CURRICULUM_LEVEL_TITLES, type CurriculumTier } from "./tier-config";

export type { CurriculumTier };
export { canAccessLesson, getLockedLessonMessage, getPricingTierParam, isSampleLesson, getSampleLessons, getLevelTitle, CURRICULUM_LEVEL_TITLES };

// ---------------------------------------------------------------------------
// Admin session detection (mirrors middleware.ts logic without HMAC verify)
// ---------------------------------------------------------------------------

const ADMIN_SESSION_COOKIE = "edunancial_admin_session";
const MEMBER_SESSION_COOKIE = "edunancial_member_session";

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
 * Effective viewer type used by the access gate.
 * "member" = any active paying/beta membership; grants access to all gated lessons.
 */
export type ViewerTier = CurriculumTier | "admin" | "member";

/**
 * Determines the viewer's effective access tier from the cookie header.
 *
 * - Valid admin session cookie → "admin"
 * - edunancial_member_session=1 → "member"
 * - Otherwise → "free"
 */
export function getViewerTierFromCookies(
  cookieHeader: string | null | undefined,
): ViewerTier {
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

  if (cookies[MEMBER_SESSION_COOKIE] === "1") {
    return "member";
  }

  return "free";
}

/**
 * Returns true when the viewer may read the full lesson body.
 *
 * Rules:
 * - admin → always allowed
 * - member → all lessons allowed
 * - free → only L1 lessons 1–3
 */
function canViewerAccessLesson(
  viewerTier: ViewerTier,
  lessonLevel: number,
  lessonNumber: number,
): boolean {
  if (viewerTier === "admin" || viewerTier === "member") return true;
  // Free preview: L1 lessons 1–3 only
  return lessonLevel === 1 && lessonNumber >= 1 && lessonNumber <= 3;
}

/**
 * Result of the access gate check for a single lesson.
 */
export interface AccessGateResult {
  /** Whether the viewer may read the full lesson body. */
  allowed: boolean;
  /** The viewer's effective tier. */
  viewerTier: ViewerTier;
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
 * @param lessonId      - Optional lesson ID (e.g. "RED-L1-001") — unused, kept for API compat.
 * @param languageCode  - Optional language code for the locked message.
 */
export function checkLessonAccess(
  lessonLevel: number,
  lessonNumber: number,
  cookieHeader: string | null | undefined,
  lessonId?: string,
  languageCode?: string,
): AccessGateResult {
  const viewerTier = getViewerTierFromCookies(cookieHeader);
  const allowed = canViewerAccessLesson(viewerTier, lessonLevel, lessonNumber);

  if (allowed) {
    return { allowed: true, viewerTier };
  }

  return {
    allowed: false,
    viewerTier,
    lockedMessage: getLockedLessonMessage(lessonLevel, languageCode),
    pricingTierParam: getPricingTierParam(lessonLevel),
  };
}
