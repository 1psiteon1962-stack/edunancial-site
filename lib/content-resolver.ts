import { resolveRegion, Region } from "./regions";

import usContent from "@/data/content/us";
import africaContent from "@/data/content/africa";
import globalContent from "@/data/content/global";

export function getRegionalContent(hostname: string) {
  const region = resolveRegion(hostname);

  switch (region) {
    case "AFRICA":
      return africaContent;
    case "US":
      return usContent;
    default:
      return globalContent;
  }
}
