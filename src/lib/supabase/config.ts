export function getSupabaseUrl(): string {
  const value = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is required for member authentication.");
  }
  return value;
}

export function getSupabaseAnonKey(): string {
  const value = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();
  if (!value) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is required for member authentication.");
  }
  return value;
}

export function getSupabaseServiceRoleKey(): string {
  const value = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim();
  if (!value) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for server-side member operations.");
  }
  return value;
}

export function hasSupabaseAuthConfig(): boolean {
  return Boolean(
    (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim()
      && (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim(),
  );
}
