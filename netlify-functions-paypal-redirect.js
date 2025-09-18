// /netlify/functions/paypal-redirect.js
// Minimal server redirect to classic PayPal "Buy Now".
// Enforces the $1 test code PR12345$$ on the server so the code never has to be shown on the page.

exports.handler = async (event) => {
  try {
    // --- CONFIG (edit the email only if needed) ---
    const BUSINESS_EMAIL = "edunancialinc@gmail.com"; // your PayPal BUSINESS email
    const RETURN_URL = "https://www.edunancial.com/thank-you.html";
    const CANCEL_URL = "https://www.edunancial.com/checkout-mini-en.html";
    const CURRENCY = "USD";

    // --- read incoming params from the checkout form ---
    const p = new URLSearchParams(event.queryStringParameters || {});

    // product metadata (optional display for PayPal screen)
    const item_name = p.get("item_name") || "Mini Course: Edunancial Method";
    const sku = p.get("sku") || "EDN-MINI-EM-001";

    // base price (server truth, don’t trust client)
    // If you add more SKUs, extend this map.
    const BASE_PRICE = {
      "EDN-MINI-EM-001": 75.0,
    };
    let amount = BASE_PRICE[sku] ?? 75.0;

    // discounts coming from the form (early-bird, membership, etc.) are *not* trusted here.
    // Only enforce the private $1 test code server-side:
    const code = (p.get("code") || "").trim();
    if (code === "PR12345$$") {
      amount = 1.0; // force $1 total for this hidden test code
    }

    // under-18 flag (purely informational for your records, not changing price here)
    const under18 = p.get("under18") === "true" ? "Yes" : "No";
    const custom = JSON.stringify({ sku, code: code ? "applied" : "", under18 });

    // Build classic PayPal GET (no external JS required)
    const paypalURL = new URL("https://www.paypal.com/cgi-bin/webscr");
    paypalURL.search = new URLSearchParams({
      cmd: "_xclick",
      business: BUSINESS_EMAIL,
      item_name,
      item_number: sku,   // shows as SKU
      amount: amount.toFixed(2),
      currency_code: CURRENCY,
      no_shipping: "1",
      no_note: "1",
      return: RETURN_URL,
      cancel_return: CANCEL_URL,
      custom,             // travels back in IPN/receipt detail
    }).toString();

    return {
      statusCode: 302,
      headers: { Location: paypalURL.toString() },
      body: "",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Server error.",
    };
  }
};
