// /netlify/functions/paypal-redirect.js
// Pure server-side pricing + redirect to PayPal (_xclick). No SDK, no client JS.

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // --------- REQUIRED: set this in Netlify > Site settings > Environment variables ----------
    const BUSINESS_EMAIL = process.env.PAYPAL_BUSINESS_EMAIL; // your PayPal business email
    // -----------------------------------------------------------------------------------------

    // Optional (already safe defaults)
    const TEST_PROMO_CODE = process.env.TEST_PROMO_CODE || 'PR12345$$';
    const EARLY_BIRD_DEADLINE = process.env.EARLY_BIRD_DEADLINE || '2025-09-26';

    if (!BUSINESS_EMAIL) {
      // Don’t fail silently—send them back with a clear message
      return {
        statusCode: 302,
        headers: { Location: '/payments.html?err=missing_business_email' },
        body: ''
      };
    }

    // Parse submitted form
    const params = new URLSearchParams(event.body || '');
    const itemName   = params.get('item_name')   || 'Edunancial Course';
    const itemNumber = params.get('item_number') || 'EDN-COURSE';
    const courseKind = params.get('course_kind') || 'mini-en';
    const membership = (params.get('membership') || 'none').toLowerCase();
    const under18    = params.get('under18') === 'yes';
    const code       = (params.get('code') || '').trim();

    // Base prices (USD)
    const BASE = { 'mini-en': 75, 'full-en': 199 };
    let price = BASE[courseKind] ?? 75;

    // Early-bird (-15% through deadline)
    const today = new Date();
    const ebEnd = new Date(`${EARLY_BIRD_DEADLINE}T23:59:59`);
    if (today <= ebEnd) price *= 0.85;

    // Membership discounts: none/basic/pro → 0/10/20%
    const OFF = { none: 0, basic: 0.10, pro: 0.20 };
    price *= (1 - (OFF[membership] ?? 0));

    // Private under-18 test code → force $1 (kept server-side, never shown on page)
    if (under18 && code === TEST_PROMO_CODE) price = 1;

    // Round & floor to at least 1 cent
    price = Math.max(0.01, Math.round(price * 100) / 100);

    // PayPal Classic “Buy Now” (no SDK)
    const paypalBase = 'https://www.paypal.com/cgi-bin/webscr';
    const returnUrl  = 'https://www.edunancial.com/thank-you.html';
    const cancelUrl  = 'https://www.edunancial.com/payments.html';

    const q = new URLSearchParams({
      cmd: '_xclick',
      business: BUSINESS_EMAIL,
      item_name: itemName,
      item_number: itemNumber,
      amount: price.toFixed(2),
      currency_code: 'USD',
      no_shipping: '1',
      no_note: '1',
      return: returnUrl,
      cancel_return: cancelUrl
    });

    return { statusCode: 302, headers: { Location: `${paypalBase}?${q}` }, body: '' };
  } catch (e) {
    return { statusCode: 500, body: 'Server error' };
  }
};
