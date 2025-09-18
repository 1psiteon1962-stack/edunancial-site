// netlify/functions/paypal-redirect.js

exports.handler = async (event) => {
  const params = event.queryStringParameters;

  const businessEmail = "YOUR_PAYPAL_BUSINESS_EMAIL"; // 👈 replace with your real PayPal email
  const itemName = encodeURIComponent(params.item_name || "Edunancial Course");
  const amount = encodeURIComponent(params.amount || "1.00");
  const currency = encodeURIComponent(params.currency || "USD");

  const returnUrl = "https://www.edunancial.com/thank-you.html";
  const cancelUrl = "https://www.edunancial.com/payments.html";

  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${businessEmail}&item_name=${itemName}&amount=${amount}&currency_code=${currency}&return=${encodeURIComponent(returnUrl)}&cancel_return=${encodeURIComponent(cancelUrl)}`;

  return {
    statusCode: 302,
    headers: {
      Location: paypalUrl,
    },
  };
};
