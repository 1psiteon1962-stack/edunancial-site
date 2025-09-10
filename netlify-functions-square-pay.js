// /netlify/functions/square-pay.js
// Netlify Function: Charges a payment with Square (card, Apple Pay, GPay)
// Requirements:
//   - Environment vars on Netlify:
//       SQUARE_ACCESS_TOKEN  (Production access token – keep secret)
//       SQUARE_LOCATION_ID   (we set this in netlify.toml = L88EVBHI)
// Notes:
//   - Uses Square Payments API directly (no SDK), ideal for Netlify.
//   - Expects POST JSON: { sourceId, amount, currency?, idempotencyKey?, verificationToken?, customerId?, note? }

const ALLOWED_ORIGINS = [
  'https://edunancial.com',
  'http://localhost:8888', // Netlify dev
  'http://localhost:3000', // local dev
];

const cors = (origin) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
  'Access-Control-Max-Age': '86400',
});

const json = (statusCode, data, origin) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    ...(origin ? cors(origin) : {}),
  },
  body: JSON.stringify(data),
});

exports.handler = async (event) => {
  const origin = ALLOWED_ORIGINS.includes(event.headers.origin)
    ? event.headers.origin
    : ALLOWED_ORIGINS[0];

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors(origin) };
  }
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method Not Allowed' }, origin);
  }

  // --- Validate env ---
  const ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
  const LOCATION_ID = process.env.SQUARE_LOCATION_ID || 'L88EVBHI'; // your prod location
  if (!ACCESS_TOKEN || !LOCATION_ID) {
    return json(500, { error: 'Server not configured for payments.' }, origin);
  }

  // --- Parse input ---
  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Invalid JSON body.' }, origin);
  }

  const {
    sourceId,                  // required: token from Web Payments SDK
    amount,                    // required: decimal dollars as number/string (e.g., "49.95")
    currency = 'USD',
    idempotencyKey,            // optional but recommended (uuid/v4)
    verificationToken,         // optional: from verifyBuyer()
    customerId,                // optional: Square customer id
    note,                      // optional: appears on payment
    referenceId,               // optional: your internal reference
  } = payload;

  if (!sourceId)  return json(400, { error: 'Missing sourceId.' }, origin);
  if (amount === undefined || amount === null) {
    return json(400, { error: 'Missing amount.' }, origin);
  }

  // Convert dollars → cents (minor units)
  const normalized = Number(amount);
  if (Number.isNaN(normalized) || normalized <= 0) {
    return json(400, { error: 'Amount must be a positive number.' }, origin);
  }
  const amountInCents = Math.round(normalized * 100);

  // Build Square Payments request
  const body = {
    idempotency_key: idempotencyKey || cryptoRandomId(),
    source_id: sourceId,
    location_id: LOCATION_ID,
    amount_money: { amount: amountInCents, currency },
    autocomplete: true, // capture immediately
  };

  if (verificationToken) body.verification_token = verificationToken;
  if (customerId)        body.customer_id = customerId;
  if (note)              body.note = note;
  if (referenceId)       body.reference_id = referenceId;

  try {
    const res = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Square-Version': '2025-01-22', // any recent version is fine
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      // Normalize Square error message
      return json(res.status, {
        error: 'Square payment failed',
        details: data,
      }, origin);
    }

    // Success — return payment info to the browser
    return json(200, {
      ok: true,
      payment: data.payment,
    }, origin);
  } catch (err) {
    return json(502, { error: 'Network error contacting Square', details: String(err) }, origin);
  }
};

// --- Helpers ---
function cryptoRandomId(len = 24) {
  // simple, URL-safe id for idempotency
  const bytes = new Uint8Array(len);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Node <19 polyfill
    const { randomBytes } = require('crypto');
    randomBytes(len).forEach((b, i) => (bytes[i] = b));
  }
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}
