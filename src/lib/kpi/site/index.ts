export interface SiteContext {
  ip: string | null;
  userAgent: string | null;
  referer: string | null;
  path: string | null;
}

export function getSiteContext(request: Request): SiteContext {
  const headers = request.headers;

  const ip =
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    null;

  const userAgent = headers.get("user-agent");
  const referer = headers.get("referer");

  let path: string | null = null;

  try {
    const url = new URL(request.url);
    path = url.pathname;
  } catch {
    path = null;
  }

  return {
    ip,
    userAgent,
    referer,
    path,
  };
}
