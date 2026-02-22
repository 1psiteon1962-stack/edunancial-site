export function getSiteContext() {
  const site_region = process.env.SITE_REGION || "us";
  const site_id = process.env.SITE_ID || "edunancial-us";
  return { site_region, site_id };
}
