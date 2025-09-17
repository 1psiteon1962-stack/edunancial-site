// netlify/functions/paypal-redirect.js
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // ---- CONFIG (edit these values) ----
  const PAYPAL_BUSINESS_EMAIL = process.env.PAYPAL_BUSINESS_EMAIL || "YOUR_PAYPAL_BUSINESS_EMAIL@EXAMPLE.COM";
  const TEST_PROMO_CODE       = process.env.TEST_PROMO_CODE       || "PR12345$$"; // secret code (kept server-side)
  const EARLY_BIRD_DEADLINE   = process.env.EARLY_BIRD_DEADLINE   || "2025-09-26"; // YYYY-MM-DD (inclusive)
  const BASE_PRICE            = 75.00; // Mini-course base price
  // -----------------------------------

  // Parse form data
  const body = new URLSearchParams(event.body || "");
  const itemName   = body.get("item_name")   || "Edunancial Course";
  const itemNumber = body.get("item_number") || "EDN-ITEM";
  const membership = (body.get("membership") || "none").toLowerCase();
  const code       = (body.get("code") || "").trim();
  const under18    = (body.get("under18") || "").toLowerCase() === "yes";
  const courseKind = (body.get("course_kind") || "").toLowerCase(); // "mini-en" in this page

  // Membership discount
  let memPct = 0;
  if (membership === "basic") memPct = 0.10;
  if (membership === "pro")   memPct = 0.20;

  // Early-bird (15% through deadline)
  const today = new Date();
  const earlyEnd = new Date(`${EARLY_BIRD_DEADLINE}T23:59:59Z`);
  const earlyPct = today <= earlyEnd ? 0.15 : 0.0;

  // Compute normal total
  const memDisc   = BASE_PRICE * memPct;
  const afterMem  = BASE_PRICE - memDisc;
  const earlyDisc = afterMem * earlyPct;
  let total       = Math.max(0, afterMem - earlyDisc);

  // Secret test code: only for English mini-course
  if (courseKind === "mini-en" && under18 && code === TEST_PROMO_CODE) {
    total = 1.00;
  }

  // Round to cents
  total = Math.round(total * 100) / 100;

  // Craft PayPal redirect (classic "_xclick")
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: PAYPAL_BUSINESS_EMAIL,
    item_name: itemName,
    item_number: itemNumber,
    amount: total.toFixed(2),
    currency_code: "USD",
    no_shipping: "1",
    no_note: "1",
    return: "https://www.edunancial.com/thank-you.html",
    cancel_return: "https://www.edunancial.com/checkout-mini-en.html"
  });

  const redirectUrl = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;

  return {
    statusCode: 302,
    headers: { Location: redirectUrl },
    body: ""
  };
};
