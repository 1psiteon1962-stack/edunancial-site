import { neon } from "@neondatabase/serverless";

export function readDatabaseUrl(): string | null {
  const value = process.env.DATABASE_URL?.trim() || process.env.NETLIFY_DATABASE_URL?.trim();
  return value || null;
}

export function getNeonSql() {
  const databaseUrl = readDatabaseUrl();
  return databaseUrl ? neon(databaseUrl) : null;
}
