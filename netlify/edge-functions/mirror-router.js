export default async (request, context) => {
  const url = new URL(request.url);

  // -------------------------------
  // GEO + REQUEST DATA
  // -------------------------------
  const country = context.geo?.country || "US";
  const region = context.geo?.subdivision || "unknown";
  const city = context.geo?.city || "unknown";
  const timezone = context.geo?.timezone || "unknown";
  const ip = context.ip || "unknown";
  const ua = request.headers.get("user-agent") || "unknown";

  // -------------------------------
  // DEFAULT (CANONICAL)
  // -------------------------------
  let site = "us-main";
  let role = "primary";
  let language = "en";
  let mirror = null;

  // -------------------------------
  // MIRROR ASSIGNMENT (SOFT)
  // -------------------------------
  if (country !== "US") {
    role = "mirror-candidate";

    if (["ES", "FR", "DE", "IT"].includes(country)) {
      mirror = "eu";
      language = country === "ES" ? "es" : "en";
    }

    if (["DO", "PR", "MX", "CO"].includes(country)) {
      mirror = "latam";
      language = "es";
    }

    if (["GH", "NG", "KE", "ZA"].includes(country)) {
      mirror = "africa";
      language = "en";
    }
  }

  // -------------------------------
  // CONTINUE REQUEST
  // -------------------------------
  const response = await context.next();

  // -------------------------------
  // INTERNAL HEADERS (CONTROL PLANE)
  // -------------------------------
  response.headers.set("X-Edunancial-Site", site);
  response.headers.set("X-Edunancial-Role", role);
  response.headers.set("X-Edunancial-Lang", language);
  response.headers.set("X-Edunancial-Country", country);
  response.headers.set("X-Edunancial-Mirror", mirror || "none");
  response.headers.set("X-Edunancial-Timestamp", new Date().toISOString());

  // -------------------------------
  // SEO SIGNALS (SAFE, NON-DISRUPTIVE)
  // -------------------------------
  response.headers.append(
    "Link",
    `<https://edunancial.com${url.pathname}>; rel="canonical"`
  );

  if (mirror) {
    response.headers.append(
      "Link",
      `<https://${mirror}.edunancial.com${url.pathname}>; rel="alternate"; hreflang="${language}"`
    );
  }

  return response;
};
