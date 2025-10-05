// Capture a PayPal Order (CommonJS, native fetch)
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const { orderID } = JSON.parse(event.body || '{}');
    if (!orderID) return { statusCode: 400, body: 'Missing orderID' };

    const base = process.env.PAYPAL_ENV === 'live'
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';

    const token = await getAccessToken(base);

    const capRes = await fetch(`${base}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const json = await capRes.json().catch(() => ({}));
    if (!capRes.ok) {
      console.error('capture-order failed:', json);
      return { statusCode: 502, body: JSON.stringify(json) };
    }

    return { statusCode: 200, body: JSON.stringify(json) };
  } catch (err) {
    console.error('capture-order error:', err);
    return { statusCode: 500, body: 'Server Error' };
  }
};

// Helper
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
