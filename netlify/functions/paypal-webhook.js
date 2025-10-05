// Netlify Function: PayPal Webhook verifier (CommonJS)
// Required Netlify environment variables (Site settings → Environment):
//   - PAYPAL_ENV: "sandbox" or "live"
//   - PAYPAL_WEBHOOK_ID: your webhook ID from the PayPal Developer Dashboard

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Headers sent by PayPal for verification
    const transmissionId   = event.headers['paypal-transmission-id'];
    const transmissionSig  = event.headers['paypal-transmission-sig'];
    const transmissionTime = event.headers['paypal-transmission-time'];
    const certUrl          = event.headers['paypal-cert-url'];
    const authAlgo         = event.headers['paypal-auth-algo'];
    const webhookEvent     = JSON.parse(event.body || '{}');
    const webhookId        = process.env.PAYPAL_WEBHOOK_ID;

    if (!webhookId || !transmissionId || !transmissionSig || !transmissionTime || !certUrl || !authAlgo) {
      return { statusCode: 400, body: 'Bad Request' };
    }

    const base =
      process.env.PAYPAL_ENV === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com';

    // Verify signature with PayPal
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

    const verifyJson = await verifyRes.json().catch(() => ({}));
    const verified = verifyJson && verifyJson.verification_status === 'SUCCESS';

    if (!verified) {
      console.log('Verification failed:', verifyJson);
      return { statusCode: 400, body: 'Verification failed' };
    }

    // ---- Handle verified events here ----
    // Examples:
    // if (webhookEvent.event_type === 'PAYMENT.CAPTURE.COMPLETED') { ... }
    // if (webhookEvent.event_type === 'CHECKOUT.ORDER.APPROVED') { ... }
    // webhookEvent.resource contains payer/order/capture details.

    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error('Webhook error:', err);
    return { statusCode: 500, body: 'Server Error' };
  }
};
