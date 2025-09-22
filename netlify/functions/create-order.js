// netlify/functions/create-order.js
// Creates a PayPal order from cart items with per-item flat discounts.
// Returns { redirectUrl } for approval.

import fetch from "node-fetch";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
    const body = JSON.parse(event.body || '{}');
    const { items = [], discountCode = '', returnUrl } = body;

    if (!Array.isArray(items) || items.length === 0) return json(400, { error: 'Cart is empty' });
    if (!returnUrl) return json(400, { error: 'Missing returnUrl' });

    // ---- Discount rules (per-item flat -> $1.00) ----
    const DISCOUNT_CODES = {
      'PR12345$$$': { type: 'perItemFlat', price: 1.00, note: 'Partner rate' },
      'UNDER18'   : { type: 'perItemFlat', price: 1.00, note: 'Under-18 rate' },
    };
    const norm = s => (s || '').toString().normalize('NFKC').replace(/\s+/g,'').replace(/[\u200B-\u200D\uFEFF]/g,'').toUpperCase();
    const rule = DISCOUNT_CODES[norm(discountCode)];

    // Compute final line items
    const lines = items.map(it => {
      const base = Number(it.price) || 0;
      const qty  = Math.max(1, parseInt(it.qty, 10) || 1);
      const unit = (rule && rule.type === 'perItemFlat') ? Number(rule.price) : base;
      const value = (unit * qty);
      return {
        name: String(it.name || it.sku || 'Item').slice(0,127),
        sku: String(it.sku || '').slice(0,127),
        unit_amount: { currency_code: 'USD', value: unit.toFixed(2) },
        quantity: String(qty),
        __lineTotal: value
      };
    });

    const total = lines.reduce((s, l) => s + l.__lineTotal, 0);

    // 1) Token
    const token = await getToken();

    // 2) Create order w/ line items so PayPal shows the exact cart
    const order = await createOrder({ lines, total, returnUrl, token });

    const approve = (order.links || []).find(l => l.rel === 'approve');
    if (!approve) return json(500, { error: 'No approval link from PayPal' });

    // (Optional) CRM webhook for analytics
    // if (process.env.CRM_WEBHOOK_URL) {
    //   await fetch(process.env.CRM_WEBHOOK_URL, {
    //     method:'POST', headers:{'Content-Type':'application/json'},
    //     body: JSON.stringify({ ts: Date.now(), type:'order-create', items, discountCode, total })
    //   });
    // }

    return json(200, { redirectUrl: approve.href });

  } catch (e) {
    console.error(e);
    return json(500, { error: 'Server error' });
  }
};

// ---- helpers ----
function json(status, obj){ return { statusCode: status, headers: { 'Content-Type':'application/json' }, body: JSON.stringify(obj) }; }

function apiBase(){
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function getToken(){
  const creds = `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`;
  const auth = Buffer.from(creds).toString('base64');
  const r = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  if (!r.ok) throw new Error('PayPal token failed');
  const j = await r.json();
  return j.access_token;
}

async function createOrder({ lines, total, returnUrl, token }){
  const r = await fetch(`${apiBase()}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: total.toFixed(2),
          breakdown: {
            item_total: { currency_code: 'USD', value: total.toFixed(2) }
          }
        },
        items: lines.map(l => ({
          name: l.name,
          sku: l.sku,
          unit_amount: l.unit_amount,
          quantity: l.quantity,
          category: 'DIGITAL_GOODS' // change to PHYSICAL_GOODS if you ship paperbacks
        }))
      }],
      application_context: {
        brand_name: 'Edunancial',
        user_action: 'PAY_NOW',
        return_url: returnUrl,
        cancel_url: returnUrl.replace(/\?paid=1$/, '') // fallback if user cancels
      }
    })
  });
  if (!r.ok) {
    const t = await r.text().catch(()=> '');
    console.error('PayPal order create failed:', t);
    throw new Error('PayPal order create failed');
  }
  return r.json();
}
