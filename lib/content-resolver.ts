import us from "@/data/content/us";
import africa from "@/data/content/africa";
import asia from "@/data/content/asia";
import india from "@/data/content/india";
import { Region } from "./regions";

export function resolveContent(region: Region) {
  switch (region) {
    case "africa":
      return africa;
    case "india":
      return india;
    case "asia":
      return asia;
    default:
      return us;
  }
}
