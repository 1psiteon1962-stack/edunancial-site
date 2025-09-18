// netlify/functions/es-paypal-redirect.js

exports.handler = async (event) => {
  const params = event.queryStringParameters;

  const businessEmail = "YOUR_PAYPAL_BUSINESS_EMAIL"; // 👈 replace with same PayPal email
  const itemName = encodeURIComponent(params.item_name || "Curso Edunancial");
  const amount = encodeURIComponent(params.amount || "1.00");
  const currency = encodeURIComponent(params.currency || "USD");

  const returnUrl = "https://www.edunancial.com/gracias.html";
  const cancelUrl = "https://www.edunancial.com/es-payments.html";

  const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${businessEmail}&item_name=${itemName}&amount=${amount}&currency_code=${currency}&return=${encodeURIComponent(returnUrl)}&cancel_return=${encodeURIComponent(cancelUrl)}`;

  return {
    statusCode: 302,
    headers: {
      Location: paypalUrl,
    },
  };
};
