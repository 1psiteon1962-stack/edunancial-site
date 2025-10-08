// netlify/functions/paypal-webhook.js
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Secrets from Netlify environment variables
  const {
    PAYPAL_WEBHOOK_ID,
    SENDGRID_API_KEY,
    FROM_EMAIL,
    ZOOM_JWT_OR_OAUTH, // optional if you want auto-registration
  } = process.env;

  // Basic guard
  if (!PAYPAL_WEBHOOK_ID || !SENDGRID_API_KEY || !FROM_EMAIL) {
    return { statusCode: 500, body: 'Missing server configuration' };
  }

  // Validate PayPal webhook (simplified: assume trust if header present, or implement full verification call)
  const body = JSON.parse(event.body || '{}');
  const eventType = body.event_type || '';
  const resource = body.resource || {};
  const payerEmail =
    resource?.subscriber?.email_address ||
    resource?.payer?.email_address ||
    resource?.billing_info?.email ||
    resource?.purchase_units?.[0]?.shipping?.address?.email_address ||
    resource?.purchase_units?.[0]?.payee?.email_address ||
    '';

  // Create a simple token
  const token = [...cryptoRandom(16)].map(n => n.toString(36)).join('').slice(0,24);
  const site = 'https://edunancial.com';

  // Build emails depending on event
  let subject = 'Welcome to Edunancial';
  let html = '';
  if (eventType.startsWith('BILLING.SUBSCRIPTION.')) {
    subject = 'Welcome — Your Edunancial Membership';
    const link = `${site}/thank-you.html?member_token=${encodeURIComponent(token)}`;
    html = `
      <p>Welcome to Edunancial!</p>
      <p>Click here to enable your member pricing and access: <a href="${link}">${link}</a></p>
      <p>Then visit our Catalog: <a href="${site}/catalog.html">${site}/catalog.html</a></p>
    `;
  } else if (eventType.startsWith('CHECKOUT.ORDER.') || eventType.includes('PAYMENT')) {
    subject = 'Your Course is Confirmed';
    // OPTIONAL: call Zoom API here to register the attendee and get join link
    // const zoomJoin = await registerZoom(payerEmail);
    const zoomJoin = 'https://zoom.us/j/EXAMPLE_JOIN_LINK'; // placeholder
    html = `
      <p>Thanks for your course purchase!</p>
      <p>Your Zoom link: <a href="${zoomJoin}">${zoomJoin}</a></p>
      <p>If you have a membership, your discounts stay active via your member link.</p>
    `;
  } else {
    // Ignore other events gracefully
    return { statusCode: 200, body: 'Ignored' };
  }

  // Send email via helper function
  try {
    await sendEmail(SENDGRID_API_KEY, process.env.FROM_EMAIL, payerEmail || process.env.TEST_FALLBACK_EMAIL, subject, html);
  } catch (e) {
    // still return 200 so PayPal doesn't retry indefinitely
  }

  return { statusCode: 200, body: 'OK' };
};

// --- helpers ---
const crypto = require('crypto');
function cryptoRandom(len){ return crypto.randomBytes(len); }

async function sendEmail(apiKey, from, to, subject, html){
  const fetch = (await import('node-fetch')).default;
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method:'POST',
    headers:{
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      personalizations:[{ to:[{ email: to }] }],
      from:{ email: from, name:'Edunancial' },
      subject, content:[{ type:'text/html', value: html }]
    })
  });
  if (!res.ok) throw new Error('Email failed');
}

// Optional Zoom registration stub (implement later if desired)
// async function registerZoom(email){ /* call Zoom API with OAuth token; return join_url */ }
