import { NextRequest } from "next/server";

import { validateAdminLogin } from "@/lib/admin-content/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }
  return validateAdminLogin(request, String(body.email), String(body.password));
}
