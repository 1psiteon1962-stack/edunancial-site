export type DatabaseProvider = "supabase" | "neon";

export function getDatabaseProvider(): DatabaseProvider {
  const value = process.env.EDUNANCIAL_DATABASE_PROVIDER?.trim().toLowerCase();
  return value === "neon" ? "neon" : "supabase";
}
