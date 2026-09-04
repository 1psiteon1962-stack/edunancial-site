import { NextRequest } from "next/server";

import { createAdminSession } from "@/lib/admin-content/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid origin." }, { status: 403 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/iu, "").trim() ?? "";
  if (!token) return Response.json({ error: "Missing email-link token." }, { status: 401 });

  const { data, error } = await getSupabaseAdminClient().auth.getUser(token);
  const email = data.user?.email?.trim().toLowerCase() ?? "";
  const configuredOwner = process.env.EDUNANCIAL_OWNER_EMAIL?.trim().toLowerCase() ?? "";
  if (error || !email || !configuredOwner || email !== configuredOwner) {
    return Response.json({ error: "This email link is invalid or unauthorized." }, { status: 403 });
  }

  await createAdminSession(email, "owner");
  return Response.json({ ok: true });
}
