const fetch = require('node-fetch');

const API = 'https://api-m.paypal.com'; // use 'https://api-m.sandbox.paypal.com' for sandbox

exports.handler = async (event) => {
  try {
    const { cart = [], applied = null } = JSON.parse(event.body || '{}');

    // compute totals
    const items = cart.map(it => ({
      name: it.title,
      unit_amount: { currency_code: 'USD', value: (+it.price).toFixed(2) },
      quantity: String(it.qty || 1),
      sku: it.sku
    }));
    let subtotal = items.reduce((s,i)=> s + (parseFloat(i.unit_amount.value) * parseInt(i.quantity)), 0);
    let discount = 0;
    let force1   = false;
    if (applied) {
      if (applied.type === 'percent') discount = subtotal * (applied.value/100);
      if (applied.type === 'flat' && applied.value === 'force-1') force1 = true;
      if (applied.type === 'flat' && typeof applied.value === 'number') discount = applied.value;
    }
    const total = force1 ? items.reduce((s,i)=> s + (1 * parseInt(i.quantity)), 0) : (subtotal - discount);

    // auth
    const id = process.env.PAYPAL_CLIENT_ID;
    const sec = process.env.PAYPAL_SECRET;
    if(!id || !sec) return { statusCode: 500, body: JSON.stringify({ error: 'Missing PayPal env vars' })};

    const tokRes = await fetch(`${API}/v1/oauth2/token`, {
      method:'POST',
      headers:{ 'Authorization':'Basic '+Buffer.from(id+':'+sec).toString('base64'), 'Content-Type':'application/x-www-form-urlencoded' },
      body:'grant_type=client_credentials'
    });
    const tok = await tokRes.json(); if(!tok.access_token) return { statusCode: 500, body: JSON.stringify({ error:'token failed', raw: tok })};

    const orderRes = await fetch(`${API}/v2/checkout/orders`, {
      method:'POST',
      headers:{ 'Authorization':'Bearer '+tok.access_token, 'Content-Type':'application/json' },
      body: JSON.stringify({
        intent:'CAPTURE',
        purchase_units:[{
          amount:{
            currency_code:'USD',
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code:'USD', value: subtotal.toFixed(2) },
              discount:   { currency_code:'USD', value: (force1 ? (subtotal - total).toFixed(2) : discount.toFixed(2)) }
            }
          },
          items
        }],
        application_context:{
          brand_name:'Edunancial',
          return_url: `${process.env.URL || 'https://edunancial.com'}/.netlify/functions/capture-order`,
          cancel_url: `${process.env.URL || 'https://edunancial.com'}/cart.html`
        }
      })
    });
    const orderJson = await orderRes.json();
    const approve = (orderJson.links||[]).find(l=>l.rel==='approve');
    return { statusCode: 200, body: JSON.stringify({ approvalUrl: approve?.href || null, orderId: orderJson.id }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message })};
  }
};
