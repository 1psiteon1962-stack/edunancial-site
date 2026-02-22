import crypto from "crypto";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export function sha256(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function hashIP(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = requiredEnv("KPI_SALT");
  // Hash with salt so it is not reversible or correlatable across systems.
  return sha256(`${salt}:${ip.trim()}`);
}
