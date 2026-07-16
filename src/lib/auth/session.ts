/**
 * Server-side session management using iron-session.
 *
 * Sessions are stored exclusively in encrypted, signed HttpOnly cookies.
 * No session data is persisted to localStorage.
 * No auth secrets are in NEXT_PUBLIC variables.
 *
 * Environment variables required:
 *   AUTH_SESSION_SECRET - At least 32 characters of random data
 *   NODE_ENV            - 'production' enables Secure cookie flag
 */

import { getIronSession, IronSession, SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export interface SessionData {
  memberId?: string;
  email?: string;
  role?: "member" | "staff" | "administrator";
  membershipTier?: "free" | "basic" | "premium" | "enterprise" | "beta";
  emailVerified?: boolean;
  isLoggedIn: boolean;
}

const SESSION_COOKIE_NAME = "edu_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  const secret = process.env.AUTH_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SESSION_SECRET must be set to at least 32 characters. " +
        "Generate one with: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    );
  }
  return secret;
}

export function getSessionOptions(): SessionOptions {
  return {
    password: getSessionSecret(),
    cookieName: SESSION_COOKIE_NAME,
    cookieOptions: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: "/",
    },
    ttl: SESSION_MAX_AGE_SECONDS,
  };
}

/**
 * Get the current session from the request cookies.
 * Use in Server Components and API Route Handlers.
 */
export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, getSessionOptions());
}

/**
 * Get the current session from a NextRequest.
 * Use in middleware or API routes that have access to the raw request.
 */
export async function getSessionFromRequest(
  req: NextRequest,
  res: NextResponse,
): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(req, res, getSessionOptions());
}

/**
 * Destroy the session (logout).
 */
export async function destroySession(): Promise<void> {
  const session = await getSession();
  session.destroy();
}

/**
 * Check if the current session has an authenticated member.
 */
export async function requireMemberSession(): Promise<SessionData & { memberId: string; email: string }> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.memberId || !session.email) {
    throw new Error("UNAUTHORIZED");
  }
  return session as SessionData & { memberId: string; email: string };
}

/**
 * Check if the current session has admin or staff role.
 */
export async function requireAdminSession(): Promise<SessionData & { memberId: string }> {
  const session = await getSession();
  if (
    !session.isLoggedIn ||
    !session.memberId ||
    (session.role !== "administrator" && session.role !== "staff")
  ) {
    throw new Error("FORBIDDEN");
  }
  return session as SessionData & { memberId: string };
}
