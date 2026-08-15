import { createServerClient } from "@supabase/ssr";
import type { CookieOptions, SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

function applyCookies(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>,
) {
  for (const { name, value, options } of cookiesToSet) {
    cookieStore.set(name, value, options);
  }
}

export async function createSupabaseServerAuthClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();

  return createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        applyCookies(cookieStore, cookiesToSet);
      },
    },
  });
}
