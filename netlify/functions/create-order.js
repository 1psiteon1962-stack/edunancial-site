// Create a PayPal Order with multiple line items (CommonJS, native fetch)
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = JSON.parse(event.body || '{}');
    const items = Array.isArray(body.items) ? body.items : [];

    const base = process.env.PAYPAL_ENV === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const token = await getAccessToken(base);

    // Build purchase unit
    let total = 0;
    const paypalItems = items.map(i => {
      const qty = Number(i.quantity || 1);
      const price = Number(i.unit_amount || 0);
      total += qty * price;
      return {
        name: String(i.name || 'Item'),
        quantity: String(qty),
        unit_amount: { currency_code: 'USD', value: price.toFixed(2) }
      };
    });

    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total.toFixed(2),
            breakdown: { item_total: { currency_code: 'USD', value: total.toFixed(2) } }
          },
          items: paypalItems
        }]
      })
    });

    if (!orderRes.ok) {
      const text = await orderRes.text();
      console.error('create-order failed:', text);
      return { statusCode: 502, body: text };
    }

    const json = await orderRes.json();
    return { statusCode: 200, body: JSON.stringify(json) };
  } catch (err) {
    console.error('create-order error:', err);
    return { statusCode: 500, body: 'Server Error' };
  }
};

// Helpers
async function getAccessToken(base) {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${id}:${secret}`).toString('base64');

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: 'grant_type=client_credentials'
  });

  const json = await res.json();
  if (!res.ok) throw new Error(`OAuth failed: ${JSON.stringify(json)}`);
  return json.access_token;
}
