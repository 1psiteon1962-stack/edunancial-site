import { headers, cookies } from "next/headers";
import { normalizeRegion, Region } from "./region";

const REGION_COOKIE = "edunancial_region";

export function getActiveRegion(): Region {
  const headerRegion = headers().get("x-edunancial-region");
  if (headerRegion) {
    return normalizeRegion(headerRegion);
  }

  const cookieRegion = cookies().get(REGION_COOKIE)?.value;
  return normalizeRegion(cookieRegion);
}
