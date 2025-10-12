// File: netlify/functions/new-member.js
export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");

    const res = await fetch(process.env.MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "edunancial-site",
        type: "paypal.subscription.approved",
        receivedAt: new Date().toISOString(),
        ...body
      })
    });

    if (!res.ok) {
      const t = await res.text();
      return { statusCode: 502, body: `Make webhook failed: ${t}` };
    }

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    return { statusCode: 500, body: String(e) };
  }
}
