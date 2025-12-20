// lib/content-resolver.ts
import { Doctrine } from "@/data/doctrine";

export type Region = "US" | "AFRICA" | "ASIA" | "GLOBAL";

export function resolveRegion(host?: string): Region {
  if (!host) return "GLOBAL";
  if (host.includes("africa")) return "AFRICA";
  if (host.includes("asia")) return "ASIA";
  if (host.includes("edunancial.com")) return "US";
  return "GLOBAL";
}

export function resolveContent<T>(
  region: Region,
  usContent: T,
  regionalOverrides?: Partial<Record<Region, Partial<T>>>
): T {
  // Doctrine enforcement: US is always the base
  if (Doctrine.authority.primarySite !== "US") {
    throw new Error("Invalid doctrine configuration");
  }

  const override = regionalOverrides?.[region] ?? {};
  return { ...usContent, ...override };
}
