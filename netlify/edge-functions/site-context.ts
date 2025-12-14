export default async (request: Request) => {
  const url = new URL(request.url);
  const host = url.hostname;

  let site = {
    site_id: "us-main",
    region: "US",
    language: "en",
    role: "primary"
  };

  if (host.startsWith("pr.")) {
    site = { site_id: "pr-mirror", region: "PR", language: "es", role: "mirror" };
  }

  if (host.startsWith("es.")) {
    site = { site_id: "es-mirror", region: "ES", language: "es", role: "mirror" };
  }

  if (host.startsWith("latam.")) {
    site = { site_id: "latam-mirror", region: "LATAM", language: "es", role: "mirror" };
  }

  const response = await fetch(request);

  const headers = new Headers(response.headers);
  headers.set("X-Edunancial-Site", site.site_id);
  headers.set("X-Edunancial-Region", site.region);
  headers.set("X-Edunancial-Language", site.language);
  headers.set("X-Edunancial-Role", site.role);

  return new Response(response.body, {
    status: response.status,
    headers
  });
};
