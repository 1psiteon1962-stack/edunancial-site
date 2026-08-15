import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { getRequestRateLimitKey, enforceMemberRateLimit } from "@/lib/auth/rate-limit";
import { sameOrigin } from "@/lib/auth/csrf";
import { recordSecurityEvent } from "@/lib/member/security";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

interface PasswordResetBody {
  email?: string;
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }

  const limit = enforceMemberRateLimit(getRequestRateLimitKey("member-password-reset", request), 5, 15 * 60_000);
  if (!limit.allowed) {
    const response = NextResponse.json({ error: "Too many reset requests. Please wait and retry." }, { status: 429 });
    response.headers.set("Retry-After", Math.ceil((limit.resetAt - Date.now()) / 1000).toString());
    return response;
  }

  let body: PasswordResetBody;
  try {
    body = (await request.json()) as PasswordResetBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?next=/reset-password`,
  });

  const admin = getSupabaseAdminClient();
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const matchedUser = data.users.find((user) => (user.email ?? "").toLowerCase() === email);
  if (matchedUser) {
    await recordSecurityEvent({
      userId: matchedUser.id,
      eventType: "auth.password_reset_requested",
      outcome: "success",
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true });
}
