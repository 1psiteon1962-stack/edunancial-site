import usContent from "@/data/content/us";
import africaContent from "@/data/content/africa";
import globalContent from "@/data/content/global";

export type Region = "US" | "AFRICA" | "GLOBAL";

export function resolveRegion(region?: string) {
  switch (region?.toUpperCase()) {
    case "US":
      return usContent;
    case "AFRICA":
      return africaContent;
    default:
      return globalContent;
  }
}
