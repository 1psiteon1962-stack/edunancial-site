export type SiteContext = {
  region: string;
};

// ✅ FIX: make parameter OPTIONAL so calls never fail
export async function getSiteContext(_options?: any): Promise<SiteContext> {
  return {
    region: "US", // default fallback
  };
}
