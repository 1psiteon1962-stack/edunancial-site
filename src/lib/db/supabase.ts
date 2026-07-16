/**
 * Supabase production client for server-side member data access.
 *
 * Uses the service_role key which bypasses RLS and is never exposed to the browser.
 * Only import this in server-side code (API routes, server components, middleware).
 *
 * Environment variables required:
 *   NEXT_PUBLIC_SUPABASE_URL  - Your Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Service role key (never NEXT_PUBLIC_*)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing Supabase configuration. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  _client = createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return _client;
}

/**
 * Check whether the Supabase configuration is present.
 * Used for graceful degradation when env vars are not yet configured.
 */
export function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}
