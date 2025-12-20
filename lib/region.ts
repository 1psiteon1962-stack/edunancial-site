// lib/region.ts
import type { Region } from "@/data/videos";

/**
 * Region resolution order:
 * 1) URL param ?region=
 * 2) Cookie "ed_region"
 * 3) Header x-ed-region (optional; set by Netlify redirects/headers if you want)
 * 4) Default = "us"
 */
export function resolveRegion(input?: string | null): Region {
  const v = (input || "").toLowerCase().trim();

  if (v === "us") return "us";
  if (v === "africa") return "africa";
  if (v === "latam" || v === "latin" || v === "latinamerica") return "latam";
  if (v === "asia") return "asia";
  if (v === "global") return "global";

  return "us";
}
