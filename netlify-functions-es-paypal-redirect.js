const BUSINESS_EMAIL = "edunancialinc@gmail.com";
const RETURN_URL = "https://www.edunancial.com/es-thank-you.html";
const CANCEL_URL = "https://www.edunancial.com/es-payments.html";

function buildPayPalUrl(fields) {
  const base = "https://www.paypal.com/cgi-bin/webscr";
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: BUSINESS_EMAIL,
    item_name: fields.item_name || "Curso de Edunancial",
    item_number: fields.sku || "SKU-N/A",
    amount: fields.amount || "1.00",
    currency_code: "USD",
    no_note: "1",
    no_shipping: "1",
    return: RETURN_URL,
    cancel_return: CANCEL_URL,
    custom: fields.custom || ""
  });
  return `${base}?${params.toString()}`;
}

function parseBody(body) {
  const p = new URLSearchParams(body || "");
  return {
    item_name: p.get("item_name"),
    sku: p.get("sku"),
    amount: p.get("amount"),
    custom: p.get("custom")
  };
}

exports.handler = async (event) => {
  if (event.httpMethod === "GET") {
    return { statusCode: 200, headers: { "content-type": "text/plain" }, body: "es-paypal-redirect: ok" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: { Allow: "GET, POST" }, body: "Method Not Allowed" };
  }
  const fields = parseBody(event.body);
  const url = buildPayPalUrl(fields);
  return { statusCode: 302, headers: { Location: url }, body: "" };
};
