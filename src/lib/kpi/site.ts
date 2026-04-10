export interface SiteContext {
  region: string;
  client_id?: string;
}

export async function getSiteContext(request?: Request): Promise<SiteContext> {
  try {
    let region = "us";

    if (request) {
      const headerRegion = request.headers.get("x-region");
      if (headerRegion && headerRegion.trim() !== "") {
        region = headerRegion.toLowerCase();
      }
    }

    return {
      region,
      client_id: "default-client",
    };
  } catch {
    return {
      region: "us",
      client_id: "default-client",
    };
  }
}
