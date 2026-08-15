/**
 * Membership-tier cookie utilities shared between the sync-membership API
 * route and the server-side curriculum access gate.
 */

import { createHmac, timingSafeEqual } from "node:crypto";

import { type NormalizedCurriculumTier } from "@/lib/curriculum/access";

export const MEMBERSHIP_TIER_COOKIE = "edu_mt";

export const VALID_TIERS: NormalizedCurriculumTier[] = ["free", "basic", "pro", "gold"];

export function getMembershipCookieSecret(): string {
  const secret =
    process.env.EDUNANCIAL_CURRICULUM_SECRET?.trim() ||
    process.env.EDUNANCIAL_ADMIN_SESSION_SECRET?.trim();

  if (!secret || secret.length < 32) {
    throw new Error(
      "A production-grade EDUNANCIAL_CURRICULUM_SECRET (minimum 32 characters) is required.",
    );
  }

  return secret;
}

export function signTier(tier: NormalizedCurriculumTier): string {
  const sig = createHmac("sha256", getMembershipCookieSecret()).update(tier).digest("base64url");
  return `${tier}.${sig}`;
}

export function verifyTierCookie(
  value: string | undefined,
): NormalizedCurriculumTier | null {
  if (!value) return null;
  const dotIdx = value.indexOf(".");
  if (dotIdx < 0) return null;
  const tier = value.slice(0, dotIdx) as NormalizedCurriculumTier;
  const sig = value.slice(dotIdx + 1);
  if (!(VALID_TIERS as string[]).includes(tier)) return null;

  let expected: string;
  try {
    expected = createHmac("sha256", getMembershipCookieSecret()).update(tier).digest("base64url");
  } catch {
    return null;
  }

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
  return tier;
}
