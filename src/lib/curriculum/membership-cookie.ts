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

/** Default lifetime for paid tiers (unchanged from the previous cookie maxAge). */
export const DEFAULT_TIER_COOKIE_TTL_SECONDS = 60 * 60 * 24 * 30;

function signature(tier: string, expiresAtSeconds: number, secret: string): string {
  // Version-tagged payload: the expiry is part of what is signed, so a saved cookie
  // cannot be replayed after its entitlement window, regardless of browser maxAge.
  return createHmac("sha256", secret).update(`v2|${tier}|${expiresAtSeconds}`).digest("base64url");
}

/**
 * Signed membership cookie value: `<tier>.<expiresAtUnixSeconds>.<hmac>`.
 * Callers pass the entitlement's real end (e.g. a beta grant's expiry); paid tiers
 * default to 30 days and are re-issued on every authenticated session refresh.
 */
export function signTier(
  tier: NormalizedCurriculumTier,
  expiresAtSeconds: number = Math.floor(Date.now() / 1000) + DEFAULT_TIER_COOKIE_TTL_SECONDS,
): string {
  const exp = Math.floor(expiresAtSeconds);
  return `${tier}.${exp}.${signature(tier, exp, getMembershipCookieSecret())}`;
}

export function verifyTierCookie(
  value: string | undefined,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): NormalizedCurriculumTier | null {
  if (!value) return null;
  const parts = value.split(".");
  // Legacy two-part cookies carried no signed expiry and are no longer accepted;
  // the next authenticated session refresh re-issues a v2 cookie automatically.
  if (parts.length !== 3) return null;
  const [tier, expRaw, sig] = parts as [NormalizedCurriculumTier, string, string];
  if (!(VALID_TIERS as string[]).includes(tier)) return null;
  if (!/^[0-9]{1,12}$/.test(expRaw)) return null;
  const exp = Number(expRaw);
  if (exp <= nowSeconds) return null;

  let expected: string;
  try {
    expected = signature(tier, exp, getMembershipCookieSecret());
  } catch {
    return null;
  }

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;
  return tier;
}
