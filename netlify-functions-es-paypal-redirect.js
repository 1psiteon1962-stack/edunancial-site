// /netlify/functions/es-paypal-redirect.js
// Same as English, but returns to Spanish thank-you page.

exports.handler = async (event) => {
  try {
    const BUSINESS_EMAIL = "edunancialinc@gmail.com"; // your PayPal BUSINESS email
    const RETURN_URL = "https://www.edunancial.com/es-thank-you.html";
    const CANCEL_URL = "https://www.edunancial.com/es-checkout.html";
    const CURRENCY = "USD";

    const p = new URLSearchParams(event.queryStringParameters || {});

    const item_name = p.get("item_name") || "Mini Curso: Método Edunancial";
    const sku = p.get("sku") || "EDN-MINI-EM-001";

    const BASE_PRICE = {
      "EDN-MINI-EM-001": 75.0,
    };
    let amount = BASE_PRICE[sku] ?? 75.0;

    const code = (p.get("code") || "").trim();
    if (code === "PR12345$$") {
      amount = 1.0;
    }

    const under18 = p.get("under18") === "true" ? "Sí" : "No";
    const custom = JSON.stringify({ sku, code: code ? "applied" : "", under18 });

    const paypalURL = new URL("https://www.paypal.com/cgi-bin/webscr");
    paypalURL.search = new URLSearchParams({
      cmd: "_xclick",
      business: BUSINESS_EMAIL,
      item_name,
      item_number: sku,
      amount: amount.toFixed(2),
      currency_code: CURRENCY,
      no_shipping: "1",
      no_note: "1",
      return: RETURN_URL,
      cancel_return: CANCEL_URL,
      custom,
    }).toString();

    return {
      statusCode: 302,
      headers: { Location: paypalURL.toString() },
      body: "",
    };
  } catch (err) {
    return { statusCode: 500, body: "Error del servidor." };
  }
};
