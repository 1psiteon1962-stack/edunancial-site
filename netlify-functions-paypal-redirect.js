// CommonJS style so it works no matter your site settings
const BUSINESS_EMAIL = "edunancialinc@gmail.com"; // the account that receives funds
const RETURN_URL = "https://www.edunancial.com/thank-you.html";
const CANCEL_URL = "https://www.edunancial.com/payments.html";

function buildPayPalUrl(fields) {
  const base = "https://www.paypal.com/cgi-bin/webscr";
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: BUSINESS_EMAIL,
    item_name: fields.item_name || "Edunancial Course",
    item_number: fields.sku || "SKU-N/A",
    amount: fields.amount || "1.00",
    currency_code: "USD",
    no_note: "1",
    no_shipping: "1",
    return: RETURN_URL,
    cancel_return: CANCEL_URL,
    // optional
    custom: fields.custom || ""
  });
  return `${base}?${params.toString()}`;
}

function parseBody(body) {
  // body is x-www-form-urlencoded
  const p = new URLSearchParams(body || "");
  return {
    item_name: p.get("item_name"),
    sku: p.get("sku"),
    amount: p.get("amount"),
    custom: p.get("custom")
  };
}

exports.handler = async (event) => {
  // Health-check: GET shows endpoint is alive
  if (event.httpMethod === "GET") {
    return { statusCode: 200, headers: { "content-type": "text/plain" }, body: "paypal-redirect: ok" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { Allow: "GET, POST" }, body: "Method Not Allowed" };
  }

  const fields = parseBody(event.body);
  const url = buildPayPalUrl(fields);

  return {
    statusCode: 302,
    headers: { Location: url },
    body: ""
  };
};
