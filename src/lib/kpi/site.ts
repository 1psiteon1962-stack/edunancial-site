export type SiteContext = {
  site_id: string;
  site_region: string;

  ip: string | null;
  userAgent: string | null;

  path: string | null;
  referer: string | null;
};

export function getSiteContext(request: Request): SiteContext {
  const headers = request.headers;

  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    null;

  const userAgent = headers.get("user-agent");

  const url = new URL(request.url);

  const path = url.pathname;
  const referer = headers.get("referer");

  const host = headers.get("host") || "";

  let site_region = "US";

  if (host.includes("africa")) site_region = "AFRICA";
  else if (host.includes("latam")) site_region = "LATAM";
  else if (host.includes("eu")) site_region = "EU";
  else if (host.includes("asia")) site_region = "ASIA";

  const site_id = "edunancial-main";

  return {
    site_id,
    site_region,
    ip,
    userAgent,
    path,
    referer,
  };
}
