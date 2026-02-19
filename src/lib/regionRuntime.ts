export type SiteRegion = "us" | "latam" | "africa" | "asia" | "mena" | "eu" | "global" | "preview" | "branch";

const FALLBACK_REGION: SiteRegion = "us";

// Reads from Netlify env var set in netlify.toml contexts
export function getSiteRegion(): SiteRegion {
  const raw = (process.env.SITE_REGION || "").toLowerCase();

  const allowed: SiteRegion[] = ["us", "latam", "africa", "asia", "mena", "eu", "global", "preview", "branch"];
  if (allowed.includes(raw as SiteRegion)) return raw as SiteRegion;

  return FALLBACK_REGION;
}
