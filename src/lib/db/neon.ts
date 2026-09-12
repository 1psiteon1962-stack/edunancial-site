import { neon } from "@neondatabase/serverless";

export function getEdunancialDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("Database configuration is unavailable.");
  return neon(url);
}
