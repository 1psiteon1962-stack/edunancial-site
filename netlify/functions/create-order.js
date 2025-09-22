// netlify/functions/create-order.js
// Creates a PayPal order for MULTIPLE items with visible discount breakdown.
// Accepts: { cart:[{sku,name,price,qty,type}], code, email, tier }
// Returns: { id, approveUrl } or { error }

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const { PAYPAL_CLIENT_ID, PAYPAL_SECRET, BRAND_NAME } = require('./config'); // you already have this

const PP_BASE = process.env.PP_BASE || 'https://api-m.paypal.com';

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }
    const { cart = [], code = '', email = '', tier = '' } = JSON.parse(event.body || '{}');

    // ---------- Pricing / Discounts ----------
    // Base price table (source of truth). Keep in USD.
    // Paperback only for books (per your current scope).
    const PRICE = {
      // COURSES
      'EDN-CRS-MIX-001': 75.00,   // Mini Course
      'EDN-CRS-BO-001' : 199.00,  // Business Formation

      // BOOKS (paperback)
      'EDN-BK-RE-001'  : 18.99,
      'EDN-BK-RE-002'  : 18.99,
      'EDN-BK-PA-001'  : 18.99,
      'EDN-BK-PA-002'  : 18.99,
      'EDN-BK-BU-001'  : 18.99,
      'EDN-BK-BU-002'  : 18.99,

      // MEMBERSHIPS (monthly)
      'MEM-STARTER'    : 5.00,
      'MEM-GROWTH'     : 15.00,
      'MEM-PRO'        : 25.00,
    };

    // Discount codes you’ve used so far (you can extend this list any time).
    // Two models supported:
    //  A) flatPerItem — force EACH eligible item to a target price (e.g., $1.00)
    //  B) absolute — subtract a fixed amount from the cart total
    //  C) percent — subtract a percent from the cart total
    const CODES = {
      // “Underprivileged / Nonprofit” example — every cart line becomes $1.00
      // (you asked for this behavior earlier).
      'PR12345$$': { type: 'flatPerItem', target: 1.00 },

      // future examples you might want:
      // 'SAVE10'    : { type: 'absolute', amount: 10.00 },
      // 'OFF20'     : { type: 'percent', rate: 0.20 },
    };

    // Validate cart and normalize
    const normCart = [];
    for (const raw of cart) {
      const sku = String(raw.sku || '').trim();
      const qty = Math.max(1, parseInt(raw.qty || 1, 10));
      if (!sku || !PRICE[sku]) continue;
      const base = PRICE[sku];
      normCart.push({
        sku,
        name: raw.name || sku,
        qty,
        basePrice: base,
        type: raw.type || 'item'
      });
    }
    if (!normCart.length) {
      return json(400, { error: 'Cart is empty or invalid.' });
    }

    // Compute item prices with code applied (per-item override if configured)
    const codeKey = String(code || '').replace(/\s+/g, '');
    const rule = CODES[codeKey];
    const discountedLines = normCart.map(line => {
      let unit = line.basePrice;

      if (rule && rule.type === 'flatPerItem') {
        // Apply flat target to EVERYTHING (your request)
        unit = rule.target;
      }
      // You may later scope by line.type === 'course' etc.

      return { ...line, unitPrice: round(unit), lineTotal: round(unit * line.qty) };
    });

    // Totals BEFORE and AFTER cart-level discounts
    const itemTotal = round(discountedLines.reduce((s, l) => s + l.lineTotal, 0));
    let cartLevelDiscount = 0;

    if (rule && rule.type === 'absolute') {
      cartLevelDiscount = Math.min(itemTotal, rule.amount);
    } else if (rule && rule.type === 'percent') {
      cartLevelDiscount = round(itemTotal * rule.rate);
    }

    const grandTotal = round(itemTotal - cartLevelDiscount);
    if (grandTotal <= 0) {
      return json(400, { error: 'Grand total must be greater than zero.' });
    }

    // ---------- PayPal OAuth ----------
    const accessToken = await getPayPalToken();

    // ---------- Build PayPal Order ----------
    const ppItems = discountedLines.map(l => ({
      name: `${l.name} (${l.sku})`,
      sku : l.sku,
      quantity: String(l.qty),
      unit_amount: { currency_code: 'USD', value: money(l.unitPrice) },
      category: l.type === 'membership' ? 'DIGITAL_GOODS' : 'PHYSICAL_GOODS'
    }));

    const body = {
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: 'EDUNANCIAL-CART',
        soft_descriptor: (BRAND_NAME || 'EDUNANCIAL').slice(0,22),
        amount: {
          currency_code: 'USD',
          value: money(grandTotal),
          breakdown: {
            item_total: { currency_code: 'USD', value: money(itemTotal) },
            discount  : { currency_code: 'USD', value: money(cartLevelDiscount) }
          }
        },
        items: ppItems
      }],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: BRAND_NAME || 'Edunancial, Inc',
            user_action: 'PAY_NOW',
            return_url: absoluteUrl('/thank-you.html'),
            cancel_url: absoluteUrl('/cart.html')
          }
        }
      },
      payer: email ? { email_address: email } : undefined
    };

    const res = await fetch(`${PP_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const txt = await res.text();
      return json(502, { error: 'PayPal create order failed', detail: txt });
    }
    const order = await res.json();
    const approveUrl = (order.links || []).find(l => l.rel === 'approve')?.href;

    return json(200, { id: order.id, approveUrl });

  } catch (err) {
    return json(500, { error: 'Server error', detail: err.message });
  }
};

// ---------- helpers ----------
function round(n){ return Math.round((n + Number.EPSILON) * 100) / 100; }
function money(n){ return round(n).toFixed(2); }
function json(code, obj){ return { statusCode: code, body: JSON.stringify(obj) }; }
async function getPayPalToken(){
  const creds = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString('base64');
  const res = await fetch(`${PP_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials'
  });
  if (!res.ok) throw new Error('PayPal auth failed');
  const data = await res.json();
  return data.access_token;
}
function absoluteUrl(path){
  // Works on Netlify – set your site URL in environment (fallback to production domain).
  const base = process.env.SITE_URL || 'https://edunancial.com';
  return base.replace(/\/+$/,'') + path;
}
