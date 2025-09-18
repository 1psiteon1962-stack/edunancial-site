// File: netlify/functions/paypal-redirect.js
// Purpose: Server-side price calc + redirect to PayPal Standard (_xclick)

exports.handler = async (event) => {
  // ★ Using your PayPal Merchant ID for security (no email exposure)
  const BUSINESS = "YOUR_PAYPAL_MERCHANT_ID";  // already on file

  // Site URLs
  const SITE = "https://www.edunancial.com";
  const RETURN_URL = `${SITE}/thank-you.html`;
  const CANCEL_URL = `${SITE}/payments.html`;

  // Early-bird deadline
  const EARLY_BIRD_DEADLINE = new Date("2025-09-26T23:59:59-05:00");
  const EARLY_BIRD_PCT = 0.15;

  // Membership discounts
  const MEMBERSHIP_DISCOUNTS = {
    none: 0,
    basic: 0.05,
    plus: 0.10,
    pro: 0.20,
  };

  // Catalog
  const CATALOG = {
    "EDN-MINI-EM-001": { name: "Mini Course: Edunancial Method", price: 75.0 },
    // You can add more SKUs here later
  };

  // Read query params
  const q = event.queryStringParameters || {};
  const sku = (q.sku || "EDN-MINI-EM-001").trim();
  const membership = (q.membership || "none").toLowerCase();
  const isMinor = q.minor === "1" || q.minor === "true";
  const code = (q.code || "").trim();

  // Item lookup
  const item = CATALOG[sku];
  if (!item) {
    return { statusCode: 400, body: `Unknown SKU: ${sku}` };
  }

  // Start with base price
  let total = item.price;

  // Membership discount
  const memPct = MEMBERSHIP_DISCOUNTS[membership] || 0;
  total = round2(total * (1 - memPct));

  // Early-bird
  if (new Date() <= EARLY_BIRD_DEADLINE) {
    total = round2(total * (1 - EARLY_BIRD_PCT));
  }

  // Special test code (not visible in page HTML)
  if (code === "PR12345$$") {
    total = 1.0;
  }

  // Safety: minimum charge
  if (total < 0.5) total = 0.5;

  // Build PayPal redirect URL
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: BUSINESS,
    item_name: item.name,
    item_number: sku,
    amount: total.toFixed(2),
    currency_code: "USD",
    return: RETURN_URL,
    cancel_return: CANCEL_URL,
    custom: JSON.stringify({
      sku,
      membership,
      isMinor,
      hadCode: Boolean(code),
      ts: Date.now(),
    }),
    no_shipping: "1",
  });

  const paypalURL = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;

  return {
    statusCode: 302,
    headers: { Location: paypalURL },
    body: "",
  };
};

// Round helper
function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
