export type SiteContext = {
  hostname: string;
  region: string;
};

export function getSiteContext(headers: Headers): SiteContext {
  const host = headers.get("host") || "";

  // Basic region detection (expand later)
  let region = "US";

  if (host.includes(".af")) region = "AFRICA";
  if (host.includes(".eu")) region = "EU";
  if (host.includes(".lat")) region = "LATAM";

  return {
    hostname: host,
    region,
  };
}
