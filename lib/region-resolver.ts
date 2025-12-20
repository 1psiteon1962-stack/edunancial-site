// lib/region-resolver.ts
// Determines region safely without breaking Netlify

import { Region } from "./content-registry";

export function resolveRegion(hostname?: string): Region {
  if (!hostname) return "us";

  const host = hostname.toLowerCase();

  if (host.includes("africa")) return "africa";
  if (host.includes("india")) return "india";

  return "us";
}
