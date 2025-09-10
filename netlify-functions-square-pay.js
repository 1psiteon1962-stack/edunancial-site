import crypto from "crypto";
const SQUARE_API_BASE = "https://connect.squareup.com";
const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const LOCATION_ID = process.env.SQUARE_LOCATION_ID;

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
  if (!ACCESS_TOKEN || !LOCATION_ID) return { statusCode: 500, body: "Server misconfigured" };

  try {
    const { sourceId, amount, currency, idempotencyKey, verificationToken, note } = JSON.parse(event.body || "{}");
    if (!sourceId || !amount) return { statusCode: 400, body: "Missing sourceId or amount" };

    const body = {
      idempotency_key: idempotencyKey || crypto.randomUUID(),
      amount_money: { amount: Number(amount), currency: currency || "USD" },
      source_id: sourceId,
      location_id: LOCATION_ID,
      autocomplete: true,
      note: note || "Edunancial charge",
      verification_token: verificationToken || undefined,
    };

    const resp = await fetch(`${SQUARE_API_BASE}/v2/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ACCESS_TOKEN}`,
        "Square-Version": "2024-08-21",
      },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    if (!resp.ok) return { statusCode: resp.status, body: JSON.stringify(data) };

    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ success: true, payment: data.payment }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
