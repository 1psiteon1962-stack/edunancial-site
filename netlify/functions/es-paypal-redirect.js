exports.handler = async (event) => {
  try {
    const BUSINESS = "ZNHWXB2MVVFX8"; // o tu correo de PayPal si lo prefieres

    const qs = new URLSearchParams(event.queryStringParameters || {});
    const item_name = (qs.get("item_name") || "Curso de Edunancial").slice(0,127);
    const currency_code = (qs.get("currency_code") || "USD").toUpperCase();

    let amount = Number(qs.get("amount") || "1.00");
    if (!isFinite(amount) || amount <= 0) amount = 1.00;

    const ingresado = (qs.get("code") || "").trim();
    const secreto = process.env.DISCOUNT_CODE || "";
    if (secreto && ingresado && ingresado === secreto) {
      amount = 1.00;
    }

    const params = new URLSearchParams({
      cmd: "_xclick",
      business: BUSINESS,
      item_name,
      amount: amount.toFixed(2),
      currency_code,
      no_shipping: "1",
      no_note: "1",
      bn: "Edunancial_BuyNow_NonHosted_ES",
      return: "https://www.edunancial.com/gracias.html",
      cancel_return: "https://www.edunancial.com/es-checkout.html",
      notify_url: "https://www.edunancial.com/ipn"
    });

    return { statusCode: 302, headers: { Location: `https://www.paypal.com/cgi-bin/webscr?${params}` }, body: "" };
  } catch (e) {
    return { statusCode: 500, body: "Server error." };
  }
};
