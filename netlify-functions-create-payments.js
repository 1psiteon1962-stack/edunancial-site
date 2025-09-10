// /.netlify/functions/create-payment.js
// Server-side: creates a Square Payment using the token (sourceId) from the Web Payments SDK.
// Requires Netlify environment variables:
//   SQUARE_ACCESS_TOKEN        (Production access token)
//   SQUARE_LOCATION_ID         (Your Square location ID)
//   SQUARE_APPLICATION_ID      (Public app ID, returned for client init)

export async function handler(event) {
  // Config endpoint (no secrets) so the client can initialize SDK
  if (event.httpMethod === 'GET' && event.queryStringParameters?.cfg === '1') {
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        applicationId: process.env.SQUARE_APPLICATION_ID,
        locationId: process.env.SQUARE_LOCATION_ID
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { sourceId, idempotencyKey, amount, currency, item, name, buyerEmail, buyerName, lang } = JSON.parse(event.body || '{}');
    if (!sourceId || !idempotencyKey || !amount || !currency) {
      return { statusCode: 400, body: JSON.stringify({ message: 'Missing payment fields.' }) };
    }

    // Build Square payment payload
    const payload = {
      source_id: sourceId,
      idempotency_key: idempotencyKey,
      location_id: process.env.SQUARE_LOCATION_ID,
      amount_money: { amount: Number(amount), currency: String(currency).toUpperCase() },
      autocomplete: true, // capture immediately
      note: `${item || 'order'} • ${name || ''}`.trim(),
      buyer_email_address: buyerEmail || undefined
    };

    const resp = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Square-Version': '2023-12-13',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();
    if (!resp.ok) {
      const msg = data?.errors?.[0]?.detail || 'Square payment error.';
      return { statusCode: resp.status, body: JSON.stringify({ message: msg }) };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: true, payment: data.payment })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ message: err.message || 'Server error' }) };
  }
}
