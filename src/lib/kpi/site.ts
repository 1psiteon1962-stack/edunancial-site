// ===============================
// SITE CONTEXT TYPES
// ===============================
export type SiteContext = {
  // ✅ REQUIRED FOR KPI SYSTEM / DATABASE
  site_id: string;
  site_region: string;

  // ✅ REQUEST CONTEXT (YOUR ORIGINAL DATA)
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  path: string | null;
};

// ===============================
// GET SITE CONTEXT FROM REQUEST
// ===============================
export function getSiteContext(request: Request): SiteContext {
  const headers = request.headers;

  // ✅ IP RESOLUTION (NETLIFY / PROXY SAFE)
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    null;

  // ✅ BASIC HEADERS
  const userAgent = headers.get("user-agent") || null;
  const referer = headers.get("referer") || null;

  // ✅ PATH EXTRACTION
  let path: string | null = null;

  try {
    const url = new URL(request.url);
    path = url.pathname;
  } catch {
    path = null;
  }

  // ===============================
  // RETURN FULL CONTEXT
  // ===============================
  return {
    // 🔒 REQUIRED (DO NOT REMOVE)
    site_id: "edunancial",
    site_region: "us",

    // 🔒 TRACKING DATA
    ip,
    userAgent,
    referer,
    path,
  };
}
