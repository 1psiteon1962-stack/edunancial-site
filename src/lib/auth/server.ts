import type { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { ensureMemberCsrfToken, validateMemberCsrf } from "@/lib/auth/csrf";
import { getRequestRateLimitKey, enforceMemberRateLimit } from "@/lib/auth/rate-limit";
import { type SessionPayload } from "@/lib/auth/types";
import { normalizeToCurriculumTier } from "@/lib/curriculum/access";
import { MEMBERSHIP_TIER_COOKIE, signTier } from "@/lib/curriculum/membership-cookie";
import { ensureUserProfile, mapAuthUser } from "@/lib/member/profile";
import { createSupabaseServerAuthClient } from "@/lib/supabase/server-auth";

export async function getAuthenticatedSupabaseUser(): Promise<User | null> {
  const supabase = await createSupabaseServerAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user ?? null;
}

export async function getAuthenticatedMemberSession(): Promise<SessionPayload> {
  const user = await getAuthenticatedSupabaseUser();
  const csrfToken = await ensureMemberCsrfToken();

  if (!user) {
    return {
      authenticated: false,
      user: null,
      csrfToken,
    };
  }

  const profile = await ensureUserProfile(user);
  return {
    authenticated: true,
    user: mapAuthUser(user, profile),
    csrfToken,
  };
}

export async function requireAuthenticatedMember() {
  const session = await getAuthenticatedMemberSession();
  if (!session.authenticated || !session.user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Authentication required." }, { status: 401 }),
    };
  }

  return {
    ok: true as const,
    session,
  };
}

export async function requireAuthenticatedMemberWrite(request: Request, scope: string, suffix = "") {
  const auth = await requireAuthenticatedMember();
  if (!auth.ok) {
    return auth;
  }

  const csrfValid = await validateMemberCsrf(request);
  if (!csrfValid) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Invalid CSRF token." }, { status: 403 }),
    };
  }

  const rateLimit = enforceMemberRateLimit(getRequestRateLimitKey(scope, request, suffix), 20, 60_000);
  if (!rateLimit.allowed) {
    const response = NextResponse.json({ error: "Too many requests. Please wait and retry." }, { status: 429 });
    response.headers.set("Retry-After", Math.ceil((rateLimit.resetAt - Date.now()) / 1000).toString());
    return {
      ok: false as const,
      response,
    };
  }

  return auth;
}

export function applyMembershipCookie(response: NextResponse, membershipTier: string) {
  response.cookies.set(MEMBERSHIP_TIER_COOKIE, signTier(normalizeToCurriculumTier(membershipTier)), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function clearMembershipCookie(response: NextResponse) {
  response.cookies.set(MEMBERSHIP_TIER_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0),
  });
}
