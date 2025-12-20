// lib/regions.ts
// Central region resolution for Edunancial
// Netlify + Next.js safe

export type Region =
  | "us"
  | "africa"
  | "asia"
  | "global";

export function resolveRegion(hostname?: string): Region {
  if (!hostname) return "us";

  const host = hostname.toLowerCase();

  // Africa mirror
  if (host.includes("africa")) return "africa";

  // Asia mirror (India, Singapore, Australia, Hong Kong)
  if (
    host.includes("asia") ||
    host.includes("india") ||
    host.includes("singapore") ||
    host.includes("australia") ||
    host.includes("hongkong")
  ) {
    return "asia";
  }

  // Default primary site
  return "us";
}
