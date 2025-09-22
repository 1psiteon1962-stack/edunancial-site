// /netlify/functions/capture-order.js
// Captures a PayPal order and returns payer details (email, name)

import fetch from "node-fetch";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const { orderID } = body;
  if (!orderID) return { statusCode: 400, body: "Missing orderID" };

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret   = process.env.PAYPAL_SECRET;
  if (!clientId || !secret) {
    return { statusCode: 500, body: "Missing PayPal credentials" };
  }

  try {
    // Get token
    const tokenRes = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + Buffer.from(clientId + ":" + secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return { statusCode: 500, body: JSON.stringify(tokenData) };

    // Capture
    const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenData.access_token}`
      }
    });
    const captureData = await captureRes.json();
    if (!captureRes.ok) return { statusCode: 500, body: JSON.stringify(captureData) };

    // Pull useful bits for tracking/Zoom later
    const payer = captureData?.payer || {};
    const email = payer.email_address || null;
    const name  = [payer.name?.given_name, payer.name?.surname].filter(Boolean).join(" ");

    // TODO (optional): write to Netlify Forms / Blobs, or email via SMTP here.

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: "COMPLETED",
        orderID,
        payerEmail: email,
        payerName: name
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
