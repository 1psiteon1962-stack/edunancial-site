export interface SiteContext {
  site_id: string;
  site_region: string;
  region?: string;
  slug?: string;
}

export function getSiteContext(): SiteContext {
  const region =
    process.env.SITE_REGION?.toLowerCase() || "us";

  return {
    site_id: "edunancial-us",
    site_region: region,
    region,
    slug: region
  };
}
