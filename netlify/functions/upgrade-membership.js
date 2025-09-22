// netlify/functions/upgrade-membership.js
// Cancels prior plan (optional) and creates a new PayPal order for upgrade
import fetch from 'node-fetch';

export const handler = async (event) => {
  try {
    const { email, currentTier, targetTier, cadence, price, code, returnUrl } = JSON.parse(event.body||'{}');
    if(!email || !targetTier || !price) return resp(400,{error:'missing fields'});

    const token = await getToken();

    // (Optional) look up customer by email in your DB and cancel existing subscription:
    // const subId = await findSubscriptionIdByEmail(email);
    // if(subId) await cancelSubscription(subId, token);

    const order = await createOrder({price, returnUrl, token});
    const approve = (order.links||[]).find(l=>l.rel==='approve');
    if(!approve) return resp(500,{error:'no approval link'});

    // (Optional) log upgrade intent
    // await fetch(process.env.CRM_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ts:Date.now(), type:'upgrade', email,currentTier,targetTier,cadence,price,code}) });

    return resp(200,{redirectUrl:approve.href
