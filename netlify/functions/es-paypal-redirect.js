export default async (req, context) => {
  if (req.method !== "GET") return new Response("Method Not Allowed", { status: 405 });

  const url = new URL(req.url);
  const item_name = url.searchParams.get("item_name");
  const amount    = url.searchParams.get("amount");
  const currency  = url.searchParams.get("currency") || "USD";

  if (!item_name || !amount) return new Response("Bad Request", { status: 400 });

  const business = "YOUR_PAYPAL_BUSINESS_EMAIL@EXAMPLE.COM";

  const returnUrl       = "https://www.edunancial.com/es-thank-you.html";   // change if needed
  const cancelReturnUrl = "https://www.edunancial.com/es-checkout.html";   // change if needed

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
