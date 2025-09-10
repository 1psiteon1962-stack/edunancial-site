import { Client, Environment } from "square";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    const { sourceId, amount, givenName, familyName, email, purpose, locationId, lang } =
      JSON.parse(event.body || "{}");

    if (!sourceId || !amount || !locationId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing fields" }) };
    }

    const client = new Client({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: (process.env.SQUARE_ENV || "production").toLowerCase() === "sandbox"
        ? Environment.Sandbox
        : Environment.Production
    });

    const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    const { result } = await client.paymentsApi.createPayment({
      sourceId,
      idempotencyKey,
      locationId,
      amountMoney: { amount: Number(amount), currency: "USD" },
      autocomplete: true,
      buyerEmailAddress: email,
      note: `Edunancial ${purpose || "payment"} • ${givenName || ""} ${familyName || ""} • ${lang || "en"}`
    });

    return { statusCode: 200, body: JSON.stringify({ paymentId: result.payment?.id || null }) };
  } catch (err) {
    const msg = err?.result?.errors?.[0]?.detail || err.message || "Payment error";
    return { statusCode: 500, body: JSON.stringify({ error: msg }) };
  }
};
