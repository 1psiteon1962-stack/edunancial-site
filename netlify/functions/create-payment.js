// netlify/functions/create-payment.js
// Handles the server-side call to Square's Payments API.
// Uses fetch (built into Node 18+ on Netlify), no npm packages needed.

export async function handler(event) {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { sourceId, amount, currency = "USD", idempotencyKey, note } =
      JSON.parse(event.body || "{}");

    if (!sourceId || !amount || !idempotencyKey) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          error: "Missing required fields: sourceId, amount, idempotencyKey",
        }),
      };
    }

    // Env: set these in Netlify > Site settings > Build & deploy > Environment
    const accessToken = process.env.SQUARE_ACCESS_TOKEN;
    const locationId = process.env.SQUARE_LOCATION_ID;
    const env = (process.env.SQUARE_ENV || "production").toLowerCase();
    const base =
      env === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com";

    if (!accessToken || !locationId) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          error:
            "Missing server environment variables SQUARE_ACCESS_TOKEN or SQUARE_LOCATION_ID.",
        }),
      };
    }

    const body = {
      idempotency_key: idempotencyKey,
      source_id: sourceId,
      amount_money: { amount: Number(amount), currency },
      location_id: locationId,
      note: note || undefined,
    };

    const resp = await fetch(`${base}/v2/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2024-08-15",
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return {
        statusCode: resp.status,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Square error", details: data }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, payment: data.payment }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Server error", details: String(err) }),
    };
  }
}
