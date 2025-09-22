// netlify/functions/create-membership.js
// Creates a PayPal order/subscription for a membership and returns {redirectUrl}
import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const { name, email, tier, cadence, price, code, profile, returnUrl } = JSON.parse(event.body||'{}');
    if(!email || !tier || !price) return resp(400,{error:'missing fields'});

    // 1) Get PayPal access token
    const token = await getToken();

    // 2) Create an order (simple monthly/annual one-time to start)
    // If you later move to Subscriptions, swap this for the Subscriptions API.
    const order = await createOrder({price, returnUrl, token});

    // 3) (Optional) Log to Google Sheet/DB via a webhook (Make.com / Zapier)
    // await fetch(process.env.CRM_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ts:Date.now(), type:'create-membership', name,email,tier,cadence,price,code,profile}) });

    // 4) Return PayPal approval link
    const approve = (order.links||[]).find(l=>l.rel==='approve');
    if(!approve) return resp(500,{error:'no approval link'});
    return resp(200,{redirectUrl:approve.href});
  } catch (e) {
    console.error(e);
    return resp(500,{error:'server error'});
  }
};

function resp(status, body){ return { statusCode: status, headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }; }

async function getToken(){
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`).toString('base64');
  const r = await fetch(`${apiBase()}/v1/oauth2/token`, {
    method:'POST',
    headers:{ 'Authorization':`Basic ${auth}`, 'Content-Type':'application/x-www-form-urlencoded' },
    body:'grant_type=client_credentials'
  });
  if(!r.ok) throw new Error('token failed');
  const j = await r.json();
  return j.access_token;
}

async function createOrder({price, returnUrl, token}){
  const r = await fetch(`${apiBase()}/v2/checkout/orders`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', 'Authorization':`Bearer ${token}` },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: { currency_code: 'USD', value: price.toFixed(2) },
        description: 'Edunancial Membership'
      }],
      application_context: {
        brand_name: 'Edunancial',
        user_action: 'PAY_NOW',
        return_url: returnUrl,                        // your page handles ?paid=1
        cancel_url: returnUrl.replace('?paid=1','')   // back to page if canceled
      }
    })
  });
  if(!r.ok) throw new Error('order create failed');
  return r.json();
}

function apiBase(){
  // set NETLIFY env var: PAYPAL_ENV = 'live' or 'sandbox'
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}
