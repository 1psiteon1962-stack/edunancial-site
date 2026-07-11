import { NextResponse } from "next/server";
import { issueCsrfToken, setCsrfCookie } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET() {
  const token = issueCsrfToken();
  const response = NextResponse.json({ success: true, csrfToken: token });
  setCsrfCookie(response, token);
  return response;
}
