export type SiteContext = {
  site_id: string;
  site_region: string;
};

// ✅ Centralized resolver (adjust logic later if needed)
export async function getSiteContext(): Promise<SiteContext> {
  return {
    site_id: "default-site",
    site_region: "us",
  };
}
