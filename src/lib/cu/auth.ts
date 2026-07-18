import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

import { CU_COOKIE_NAME } from "@/lib/cu/constants";

const FALLBACK_TEMP_PASSWORD = "WeekendCUAccess2026!";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function expectedPassword() {
  return process.env.CU_TEMP_PASSWORD?.trim() || FALLBACK_TEMP_PASSWORD;
}

function authCookieValue() {
  return createHash("sha256").update(expectedPassword()).digest("hex");
}

export function verifyCuPassword(input: string) {
  const provided = digest(input);
  const expected = digest(expectedPassword());
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

export async function hasCuAccess() {
  const cookieStore = await cookies();
  return cookieStore.get(CU_COOKIE_NAME)?.value === authCookieValue();
}

export function requestHasCuAccess(request: NextRequest) {
  return request.cookies.get(CU_COOKIE_NAME)?.value === authCookieValue();
}

export function applyCuAccessCookie(response: NextResponse) {
  response.cookies.set(CU_COOKIE_NAME, authCookieValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

export function clearCuAccessCookie(response: NextResponse) {
  response.cookies.set(CU_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function requireCuAccess(request: NextRequest) {
  if (requestHasCuAccess(request)) {
    return null;
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
