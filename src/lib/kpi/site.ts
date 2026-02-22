import type { SiteContext } from "./types";

function requiredEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export function getSiteContext(): SiteContext {
  return {
    site_id: requiredEnv("SITE_ID"),
    site_region: requiredEnv("SITE_REGION"),
  };
}
