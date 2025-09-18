exports.handler = async (event) => {
  try {
    // Prefer Merchant ID to avoid INVALID_BUSINESS_ERROR
    const BUSINESS = "ZNHWXB2MVVFX8"; // or set your email instead

    const qs = new URLSearchParams(event.queryStringParameters || {});
    const item_name = (qs.get("item_name") || "Edunancial Course").slice(0,127);
    const currency_code = (qs.get("currency_code") || "USD").toUpperCase();

    // Amount from client (visual calc)
    let amount = Number(qs.get("amount") || "1.00");
    if (!isFinite(amount) || amount <= 0) amount = 1.00;

    // --- SECRET DISCOUNT ($1) ---
    // Set this in Netlify > Site settings > Environment variables:
    //   DISCOUNT_CODE = your_secret_code (e.g. PR12345$$)
    // Nothing about the code is shipped to the browser.
    const entered = (qs.get("code") || "").trim();
    const secret = process.env.DISCOUNT_CODE || "";
    if (secret && entered && entered === secret) {
      amount = 1.00; // override to $1
    }

    const params = new URLSearchParams({
      cmd: "_xclick",
      business: BUSINESS,
      item_name,
      amount: amount.toFixed(2),
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
