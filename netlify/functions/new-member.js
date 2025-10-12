// new-member.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    // Verify that the request is POST
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse incoming PayPal payload
    const data = JSON.parse(event.body || "{}");
    const { payer_email, payer_name, amount, product_name } = data;

    // Simple anti-spam: block missing or fake payloads
    if (!payer_email || !payer_name) {
      return { statusCode: 400, body: "Invalid Request" };
    }

    // Send to your Make.com webhook
    const MAKE_WEBHOOK_URL = process.env.MAKE_WEBHOOK_URL;
    if (!MAKE_WEBHOOK_URL) {
      return { statusCode: 500, body: "Webhook not configured" };
    }

    const makeRes = await fetch(MAKE_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: payer_name,
        email: payer_email,
        amount,
        product: product_name || "Membership",
      }),
    });

    if (!makeRes.ok) {
      throw new Error(`Make webhook failed: ${makeRes.statusText}`);
    }

    // Respond success to PayPal redirect
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Member processed" }),
    };
  } catch (err) {
    console.error("Error:", err);
    return { statusCode: 500, body: `Server error: ${err.message}` };
  }
}
