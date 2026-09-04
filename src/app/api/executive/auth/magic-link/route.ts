import { createClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

function ownerEmail() {
  return process.env.EDUNANCIAL_OWNER_EMAIL?.trim().toLowerCase() ?? "";
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ error: "Invalid origin." }, { status: 403 });
  }

  const configuredOwner = ownerEmail();
  if (!configuredOwner) {
    return Response.json({ error: "Owner email login is not configured." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { email?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (email !== configuredOwner) {
    return Response.json({ error: "This email is not authorized for owner access." }, { status: 403 });
  }

  const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${new URL(request.url).origin}/executive/auth/callback`,
    },
  });
  if (error) {
    return Response.json({ error: `Could not send secure email: ${error.message}` }, { status: 502 });
  }

  return Response.json({ ok: true });
}
