export interface SiteContext {
  region: string;
  host: string | null;
  siteName: string;
}

export function getSiteContext(): SiteContext {
  const host =
    process.env.NEXT_PUBLIC_SITE_HOST ||
    null;

  const region =
    process.env.SITE_REGION?.toLowerCase() ||
    "us";

  return {
    region,
    host,
    siteName: "Edunancial"
  };
}
