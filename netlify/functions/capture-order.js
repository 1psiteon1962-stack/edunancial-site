const fetch = require('node-fetch');

const API = 'https://api-m.paypal.com'; // use 'https://api-m.sandbox.paypal.com' for sandbox

exports.handler = async (event) => {
  const token = (event.queryStringParameters||{}).token;
  if(!token) return { statusCode:400, body:'Missing order token' };

  try{
    const id = process.env.PAYPAL_CLIENT_ID;
    const sec = process.env.PAYPAL_SECRET;
    const tokRes = await fetch(`${API}/v1/oauth2/token`, {
      method:'POST',
      headers:{ 'Authorization':'Basic '+Buffer.from(id+':'+sec).toString('base64'), 'Content-Type':'application/x-www-form-urlencoded' },
      body:'grant_type=client_credentials'
    });
    const tok=await tokRes.json();

    const capRes = await fetch(`${API}/v2/checkout/orders/${token}/capture`, {
      method:'POST',
      headers:{ 'Authorization':'Bearer '+tok.access_token, 'Content-Type':'application/json' }
    });
    const data=await capRes.json();

    return {
      statusCode: 302,
      headers: { Location: '/thank-you.html' },
      body: ''
    };
  }catch(e){
    return { statusCode:500, body:'Capture failed: '+e.message };
  }
};
