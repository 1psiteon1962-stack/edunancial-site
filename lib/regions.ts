// lib/regions.ts

export type Region = "US" | "AFRICA" | "GLOBAL";

export function resolveRegion(hostname: string): Region {
  if (hostname.endsWith(".africa") || hostname.includes("africa")) {
    return "AFRICA";
  }
  if (hostname.endsWith(".com") || hostname.includes("edunancial")) {
    return "US";
  }
  return "GLOBAL";
}
