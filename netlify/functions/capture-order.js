// capture-order.js (Netlify function)
const fetch = require('node-fetch');

exports.handler = async (event) => {
  const token = (event.queryStringParameters||{}).token;
  if(!token) return { statusCode: 400, body: 'Missing order token' };

  try {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    const tokenRes = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: { 'Authorization': 'Basic ' + Buffer.from(clientId+':'+secret).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'grant_type=client_credentials'
    });
    const tok = await tokenRes.json();
    const captureRes = await fetch(`https://api-m.paypal.com/v2/checkout/orders/${token}/capture`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + tok.access_token, 'Content-Type': 'application/json' }
    });
    const data = await captureRes.json();
    // TODO: persist order in DB / send email / update membership etc.
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: `<html><body><h1>Payment received</h1><p>Thank you — order captured.</p><p><a href="/thank-you.html">Continue</a></p></body></html>`
    };
  } catch (err) {
    return { statusCode: 500, body: 'Capture failed: '+err.message };
  }
};
