// Netlify Function: PayPal Webhook verifier
// Set env vars in Netlify UI:
//  - PAYPAL_WEBHOOK_ID   (from PayPal Developer Dashboard)
//  - PAYPAL_ENV          ("live" or "sandbox")
export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Headers PayPal sends for verification
  const transmissionId = event.headers['paypal-transmission-id'];
  const transmissionSig = event.headers['paypal-transmission-sig'];
  const transmissionTime = event.headers['paypal-transmission-time'];
  const certUrl = event.headers['paypal-cert-url'];
  const authAlgo = event.headers['paypal-auth-algo'];
  const webhookEvent = JSON.parse(event.body || '{}');
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  // Minimal safety check
  if (!webhookId || !transmissionId || !transmissionSig || !transmissionTime || !certUrl || !authAlgo) {
    console.log('Missing verification headers or webhookId');
    return { statusCode: 400, body: 'Bad Request' };
  }

  // Call PayPal to verify the signature
  const base = process.env.PAYPAL_ENV === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

  // You do NOT need client secret to use the verification endpoint if you pass headers/body as received
  const verifyRes = await fetch(`${base}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: webhookEvent
    })
  });

  const verifyJson = await verifyRes.json().catch(()=> ({}));
  const verified = verifyJson.verification_status === 'SUCCESS';

  if (!verified) {
    console.log('Webhook verification failed', verifyJson);
    return { statusCode: 400, body: 'Verification failed' };
  }

  // Process events
  const eventType = webhookEvent.event_type;
  console.log('Verified PayPal event:', eventType);

  // TODO: fulfill here (e.g., grant membership, send email)
  // You can inspect webhookEvent.resource for order/capture details.

  return { statusCode: 200, body: 'OK' };
}
