export default async (request, context) => {
  const url = new URL(request.url);

  // --- BASIC GEO / REQUEST DATA ---
  const country = context.geo?.country || "US";
  const region = context.geo?.subdivision || "unknown";
  const city = context.geo?.city || "unknown";
  const timezone = context.geo?.timezone || "unknown";
  const ip = context.ip || "unknown";

  // --- MIRROR LOGIC (FOUNDATION) ---
  let site = "us-main";
  let role = "primary";
  let language = "en";

  // Future mirror rules (disabled for now, ready later)
  // if (country === "ES") site = "eu-es";
  // if (country === "DO") site = "caribbean";
  // if (country === "FR") language = "fr";

  // --- INTERNAL CONTEXT OBJECT ---
  const mirrorContext = {
    site,
    role,
    language,
    country,
    region,
    city,
    timezone,
    ip,
    userAgent: request.headers.get("user-agent"),
    timestamp: new Date().toISOString()
  };

  // --- PASS CONTEXT INTERNALLY (NO UI EXPOSURE) ---
  const response = await context.next();

  response.headers.set("X-Edunancial-Site", site);
  response.headers.set("X-Edunancial-Role", role);
  response.headers.set("X-Edunancial-Lang", language);
  response.headers.set("X-Edunancial-Country", country);
  response.headers.set("X-Edunancial-Timestamp", mirrorContext.timestamp);

  return response;
};
