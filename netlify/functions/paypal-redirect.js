exports.handler = async (event) => {
  try {
    // Use EXACTLY ONE of these lines:
    const BUSINESS = "ZNHWXB2MVVFX8";                  // ✅ Merchant ID (recommended)
    // const BUSINESS = "1psiteon1962@gmail.com";       // or your PayPal email

    const qs = new URLSearchParams(event.queryStringParameters || {});
    const item_name = (qs.get("item_name") || "Edunancial Course").slice(0, 127);
    const amount = Number(qs.get("amount") || "1.00").toFixed(2);
    const currency_code = (qs.get("currency_code") || "USD").toUpperCase();

    const params = new URLSearchParams({
      cmd: "_xclick",
      business: BUSINESS,
      item_name,
      amount,
      currency_code,
      no_shipping: "1",
      no_note: "1",
      bn: "Edunancial_BuyNow_NonHosted",
      return: "https://www.edunancial.com/thank-you.html",
      cancel_return: "https://www.edunancial.com/checkout.html",
      notify_url: "https://www.edunancial.com/ipn"
    });

    return { statusCode: 302, headers: { Location: `https://www.paypal.com/cgi-bin/webscr?${params}` }, body: "" };
  } catch (e) {
    return { statusCode: 500, body: "Server error." };
  }
};
