// create-order.js (Netlify function)
const fetch = require('node-fetch');

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');
    const cart = body.cart || [];
    const applied = body.applied || null;

    // sum items
    let items = cart.map(it => ({
      name: it.title,
      unit_amount: { currency_code: 'USD', value: it.price.toFixed(2) },
      quantity: String(it.qty || 1),
      sku: it.sku
    }));
    let subtotal = items.reduce((s,it)=> s + (parseFloat(it.unit_amount.value) * parseInt(it.quantity)), 0);

    // discount
    let discount = 0;
    if(applied && applied.disc){
      if(applied.disc.type === 'percent') discount = subtotal * (applied.disc.value/100);
      else discount = applied.disc.value || 0;
    }

    const total = (subtotal - discount).toFixed(2);

    // PayPal token
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    if(!clientId || !secret) return { statusCode: 500, body: JSON.stringify({ error: 'PayPal credentials missing' }) };

    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + Buffer.from(clientId+':'+secret).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    });
    const tok = await tokenRes.json();
    if(!tok.access_token) return { statusCode: 500, body: JSON.stringify({ error: 'Failed to get PayPal token', raw: tok }) };

    // create order
    const orderRes = await fetch('https://api-m.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + tok.access_token
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: total,
            breakdown: {
              item_total: { currency_code: 'USD', value: subtotal.toFixed(2) },
              discount: { currency_code:'USD', value: discount.toFixed(2) }
            }
          },
          items: items
        }],
        application_context: {
          brand_name: 'Edunancial',
          return_url: `${process.env.URL || 'https://your-site.com'}/.netlify/functions/capture-order?source=paypal`,
          cancel_url: `${process.env.URL || 'https://your-site.com'}/cart.html`
        }
      })
    });

    const orderJson = await orderRes.json();
    const approval = (orderJson.links||[]).find(l=>l.rel==='approve');
    return { statusCode: 200, body: JSON.stringify({ approvalUrl: approval ? approval.href : null, order: orderJson }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
