// ✅ REPLACE YOUR ENTIRE /netlify/functions/collect.js WITH THIS FILE (FULL FILE — NOT PIECEMEAL)
exports.handler = async function (event) {
  try {
    // Allow only POST
    if ((event.httpMethod || "").toUpperCase() !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const data = JSON.parse(event.body || "{}");

    // Normalize and limit size so logs don't explode
    const out = {
      timestamp: new Date().toISOString(),
      site: String(data.site || "unknown").slice(0, 64),
      region: String(data.region || "unknown").slice(0, 32),
      role: String(data.role || "unknown").slice(0, 32),
      language: String(data.language || "unknown").slice(0, 16),
      path: String(data.path || "").slice(0, 256),
      referrer: String(data.referrer || "").slice(0, 512),
      userAgent: String(data.userAgent || "").slice(0, 256)
    };

    // This is your internal tracking stream (view in Netlify function logs)
    console.log("EDUNANCIAL_TRAFFIC", out);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store"
      },
      body: JSON.stringify({ status: "ok" })
    };
  } catch (err) {
    console.log("EDUNANCIAL_TRAFFIC_ERROR", String(err && err.message ? err.message : err));
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
      body: JSON.stringify({ error: "bad_request" })
    };
  }
};
