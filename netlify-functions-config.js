// Returns public config to the browser (no secrets).
export default async (req, context) => {
  const appId = process.env.SQUARE_APP_ID || "";
  // If you don't want to set SQUARE_LOCATION_ID, we’ll try to auto-pick one:
  let locationId = process.env.SQUARE_LOCATION_ID || "";

  if (!locationId && process.env.SQUARE_ACCESS_TOKEN) {
    try {
      const r = await fetch("https://connect.squareup.com/v2/locations", {
        headers: {
          Authorization: `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      });
      const data = await r.json();
      const loc = (data.locations || []).find(
        l => l.status === "ACTIVE" && l.capabilities?.includes("CREDIT_CARD_PROCESSING")
      );
      if (loc?.id) locationId = loc.id;
    } catch (_) {}
  }

  return new Response(JSON.stringify({ appId, locationId }), {
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
};
