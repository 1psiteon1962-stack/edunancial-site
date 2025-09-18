exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const MERCHANT_ID = "ZNHWXB2MVVFX8"; // your PayPal Merchant ID

  const BASE_PRICE = parseFloat(process.env.BASE_PRICE || "75.00");
  const CHILD_PRICE = parseFloat(process.env.CHILD_PRICE || "1.00");
  const PROMO_CODE = (process.env.PROMO_CODE || "").trim();

  const itemName = params.item_name || "Mini Course: Edunancial Method";
  const currency = params.currency_code || "USD";
  const code = (params.code || "").trim();

  let amount = BASE_PRICE;
  if (PROMO_CODE && code && code === PROMO_CODE) amount = CHILD_PRICE;

  const returnUrl = "https://www.edunancial.com/thank-you";
  const cancelUrl = "https://www.edunancial.com/cancelled";

  const url =
    "https://www.paypal.com/cgi-bin/webscr" +
    `?cmd=_xclick` +
    `&business=${encodeURIComponent(MERCHANT_ID)}` +
    `&item_name=${encodeURIComponent(itemName)}` +
    `&amount=${encodeURIComponent(amount.toFixed(2))}` +
    `&currency_code=${encodeURIComponent(currency)}` +
    `&no_shipping=1` +
    `&return=${encodeURIComponent(returnUrl)}` +
    `&cancel_return=${encodeURIComponent(cancelUrl)}`;

  return { statusCode: 302, headers: { Location: url } };
};
