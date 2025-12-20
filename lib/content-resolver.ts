import usContent from "@/data/content/us";
import africaContent from "@/data/content/africa";
import indiaContent from "@/data/content/india";
import globalContent from "@/data/content/global";

export type Region = "us" | "africa" | "india" | "global";

export function resolveContent(region?: string) {
  switch (region) {
    case "us":
      return usContent;
    case "africa":
      return africaContent;
    case "india":
      return indiaContent;
    default:
      return globalContent;
  }
}
