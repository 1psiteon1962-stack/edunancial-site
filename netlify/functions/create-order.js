// /netlify/functions/create-order.js
// Creates a PayPal order for a whole cart and applies your discount codes.

import fetch from "node-fetch";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // ---- 1) Parse request ----
  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { items = [], discountCode = "", buyerEmail = "" } = body;

  // Each item should be: { id, name, unitPrice, quantity }
  // unitPrice is a number/string like "75.00"
  if (!Array.isArray(items) || items.length === 0) {
    return { statusCode: 400, body: "Cart is empty" };
  }

  // ---- 2) Discount rules (TODAY: valid code => every item $1.00) ----
  // Add/adjust codes here (exact match, spaces ignored, case-insensitive)
  const VALID_CODES = new Set([
    "PR12345$$$",
    "PR2345$$$",
    "PR345$$$",
    "PR12345S$$$",
    "PR2345S$$$",
  ].map(c => c.replace(/\s+/g, "").toUpperCase()));

  const normalized = (discountCode || "").replace(/\s+/g, "").toUpperCase();
  const discountIsValid = VALID_CODES.has(normalized);

  // Build PayPal items
  const ppItems = items.map(it => {
    const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
    const price = discountIsValid ? 1.00 : parseFloat(it.unitPrice);
    return {
      name: it.name?.toString().slice(0,127) || "Item",
      quantity: String(qty),
      unit_amount: {
        currency_code: "USD",
        value: price.toFixed(2)
      }
    };
  });

  // Compute total
  const total = ppItems.reduce((sum, it) => {
    return sum + parseFloat(it.unit_amount.value) * parseInt(it.quantity, 10);
  }, 0);

  // ---- 3) Get OAuth token ----
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret    = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) {
    return { statusCode: 500, body: "Missing PayPal credentials" };
  }

  try {
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(clientId + ":" + secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      return { statusCode: 500, body: JSON.stringify(tokenData) };
    }

    // ---- 4) Create order ----
    const orderRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenData.access_token}`
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: total.toFixed(2)
              }
            }
          },
          items: ppItems,
          custom_id: normalized || undefined
        }],
        payer: buyerEmail ? { email_address: buyerEmail } : undefined,
        application_context: {
          brand_name: "Edunancial, Inc.",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${process.env.URL || "https://edunancial.com"}/thank-you.html`,
          cancel_url: `${process.env.URL || "https://edunancial.com"}/checkout.html`
        }
      })
    });

    const orderData = await orderRes.json();
    if (!orderRes.ok) {
      return { statusCode: 500, body: JSON.stringify(orderData) };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderData.id, total: total.toFixed(2) })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
