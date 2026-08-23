/**
 * Server-side Curriculum Access Gate
 *
 * Determines the viewer's effective membership tier from the incoming request
 * and exposes helpers used by lesson viewer pages and API routes to enforce
 * server-side access control.
 *
 * Membership tier resolution order:
 * 1. Valid admin session cookie → "admin" (bypasses all gating)
 * 2. Valid signed edu_mt membership-tier cookie → the user's normalized tier
 * 3. Otherwise → "free" (no membership, public lessons only)
 */

import { canAccessLesson, getLockedLessonMessage, getPricingTierParam, isSampleLesson, getSampleLessons, getLevelTitle, CURRICULUM_LEVEL_TITLES, type CurriculumTier } from "./tier-config";
import { verifyTierCookie, MEMBERSHIP_TIER_COOKIE } from "@/lib/curriculum/membership-cookie";

export type { CurriculumTier };
export { canAccessLesson, getLockedLessonMessage, getPricingTierParam, isSampleLesson, getSampleLessons, getLevelTitle, CURRICULUM_LEVEL_TITLES };

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

export type ViewerTier = CurriculumTier | "admin";

export function getViewerTierFromCookies(
  cookieHeader: string | null | undefined,
): ViewerTier {
  if (!cookieHeader) return "free";

  const cookieMap: Record<string, string> = {};
  for (const part of cookieHeader.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const key = part.slice(0, eq).trim();
    const val = part.slice(eq + 1).trim();
    cookieMap[key] = val;
  }

  if (isValidAdminSession(cookieMap[ADMIN_SESSION_COOKIE])) {
    return "admin";
  }

  const membershipTier = verifyTierCookie(cookieMap[MEMBERSHIP_TIER_COOKIE]);
  if (membershipTier) {
    return membershipTier as CurriculumTier;
  }

  return "free";
}

export interface AccessGateResult {
  allowed: boolean;
  viewerTier: ViewerTier;
  lockedMessage?: string;
  pricingTierParam?: string | null;
}

export function checkLessonAccess(
  lessonLevel: number,
  lessonNumber: number,
  cookieHeader: string | null | undefined,
  lessonId?: string,
  languageCode?: string,
): AccessGateResult {
  const viewerTier = getViewerTierFromCookies(cookieHeader);
  const allowed = canAccessLesson(
    lessonLevel,
    lessonNumber,
    viewerTier,
    lessonId,
  );

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
