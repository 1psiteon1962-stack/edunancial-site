// /.netlify/functions/create-order.js
const fetch = global.fetch || require('node-fetch');

// --- PayPal credentials (already configured in your existing config.js) ---
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE } = require('./config');

// helper to get OAuth token
async function getToken() {
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
    // node-fetch: put auth in header
    auth: `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal auth failed: ${t}`);
  }
  return (await res.json()).access_token;
}

function money(n){ return { currency_code:'USD', value: (Math.round(n*100)/100).toFixed(2) }; }

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: JSON.stringify({ error:'Method not allowed' }) };
    }

    const { email, items, discount, meta } = JSON.parse(event.body || '{}');

    if (!Array.isArray(items) || !items.length) {
      return { statusCode: 400, body: JSON.stringify({ error:'Cart is empty' }) };
    }

    // Build PayPal line items
    let item_total = 0;
    const ppItems = items.map(it => {
      const unit = Number(it.unit_amount);
      const qty  = Number(it.quantity||1);
      item_total += unit * qty;
      return {
        name: it.name.slice(0,120),
        sku: it.sku,
        quantity: String(qty),
        unit_amount: money(unit),
        category: 'DIGITAL_GOODS'
      };
    });

    let discountAmount = 0;
    if (discount && Number(discount.amount) > 0) {
      discountAmount = Math.min(item_total, Number(discount.amount));
    }

    const token = await getToken();

    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [{
        custom_id: meta && meta.code ? `CODE:${meta.code}` : undefined,
        description: 'Edunancial Order',
        items: ppItems,
        amount: {
          currency_code: 'USD',
          value: (item_total - discountAmount).toFixed(2),
          breakdown: {
            item_total: money(item_total),
            discount: money(discountAmount)
          }
        }
      }],
      application_context: {
        brand_name: 'Edunancial, Inc.',
        user_action: 'PAY_NOW',
        return_url: `${process.env.URL || ''}/thank-you.html`,
        cancel_url: `${process.env.URL || ''}/cart.html`
      },
      payer: email ? { email_address: email } : undefined
    };

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    if (!res.ok) {
      return { statusCode: 400, body: JSON.stringify({ error: data && data.message || 'PayPal order error', details:data })};
    }

    const approval = (data.links||[]).find(l => l.rel === 'approve');
    return {
      statusCode: 200,
      body: JSON.stringify({ id: data.id, approvalUrl: approval && approval.href })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
