export function getSiteContext(request: Request) {
  const headers = request.headers;

  return {
    site_id: headers.get("x-site-id") || "default-site",
    site_region: headers.get("x-site-region") || "us",

    ip:
      headers.get("x-forwarded-for") ||
      headers.get("x-real-ip") ||
      null,

    userAgent: headers.get("user-agent"),
    path: headers.get("x-path") || null,
    referer: headers.get("referer") || null,
  };
}
