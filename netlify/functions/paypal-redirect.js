export default async (req, context) => {
  // Only allow GET
  if (req.method !== "GET") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // Required params we expect from /checkout.html links
  const url = new URL(req.url);
  const item_name = url.searchParams.get("item_name");
  const amount    = url.searchParams.get("amount");   // e.g. "63.75"
  const currency  = url.searchParams.get("currency") || "USD";

  if (!item_name || !amount) {
    return new Response("Bad Request", { status: 400 });
  }

  // Your PayPal BUSINESS email (receiver)
  const business = "YOUR_PAYPAL_BUSINESS_EMAIL@EXAMPLE.COM";

  // Where PayPal returns/cancels after payment
  const returnUrl       = "https://www.edunancial.com/thank-you.html";
  const cancelReturnUrl = "https://www.edunancial.com/checkout.html";

  // Classic form-based checkout endpoint
  const paypal = new URL("https://www.paypal.com/cgi-bin/webscr");
  paypal.searchParams.set("cmd", "_xclick");
  paypal.searchParams.set("business", business);
  paypal.searchParams.set("item_name", item_name);
  paypal.searchParams.set("amount", amount);
  paypal.searchParams.set("currency_code", currency);
  paypal.searchParams.set("no_shipping", "1");
  paypal.searchParams.set("no_note", "1");
  paypal.searchParams.set("return", returnUrl);
  paypal.searchParams.set("cancel_return", cancelReturnUrl);

  return Response.redirect(paypal.toString(), 302);
};
