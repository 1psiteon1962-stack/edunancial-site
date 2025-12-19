// lib/content-resolver.ts

import usContent from "@/data/content/us";
import africaContent from "@/data/content/africa";
import globalContent from "@/data/content/global";

export type Region = "us" | "africa" | "global";

export function resolveContent(region: Region) {
  switch (region) {
    case "africa":
      return africaContent;
    case "global":
      return globalContent;
    case "us":
    default:
      return usContent;
  }
}
