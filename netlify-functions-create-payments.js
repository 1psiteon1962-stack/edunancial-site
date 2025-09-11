// Creates a payment using Square's Payments API.
// Expects JSON body: { sourceId, amount, currency, note }
const SQUARE_BASE = "https://connect.squareup.com"; // production

function uid() {
  return ("xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx").replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default async (req, context) => {
  if (req.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  const accessToken = process.env.SQUARE_ACCESS_TOKEN;
  let locationId = process.env.SQUARE_LOCATION_ID || "";

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Missing SQUARE_ACCESS_TOKEN" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  const body = await req.json().catch(() => ({}));
  const { sourceId, amount, currency = "USD", note = "" } = body || {};
  if (!sourceId || !amount) {
    return new Response(JSON.stringify({ error: "sourceId and amount are required" }), {
      status: 400, headers: { "Content-Type": "application/json" }
    });
  }

  // Discover a location if one isn't provided
  if (!locationId) {
    const r = await fetch(`${SQUARE_BASE}/v2/locations`, {
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" }
    });
    const data = await r.json();
    const loc = (data.locations || []).find(
      l => l.status === "ACTIVE" && l.capabilities?.includes("CREDIT_CARD_PROCESSING")
    );
    if (!loc?.id)
      return new Response(JSON.stringify({ error: "No active processing location found" }), {
        status: 500, headers: { "Content-Type": "application/json" }
      });
    locationId = loc.id;
  }

  // Create the payment
  const resp = await fetch(`${SQUARE_BASE}/v2/payments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      idempotency_key: uid(),
      source_id: sourceId,
      location_id: locationId,
      amount_money: { amount: Number(amount), currency },
      note
    })
  });

  const result = await resp.json();
  const status = resp.status;
  return new Response(JSON.stringify(result), {
    status, headers: { "Content-Type": "application/json" }
  });
};
