exports.handler = async (event) => {
  try {
    // Usa SOLO una línea:
    const BUSINESS = "ZNHWXB2MVVFX8";                  // ✅ ID de comerciante (recomendado)
    // const BUSINESS = "1psiteon1962@gmail.com";       // o tu correo de PayPal

    const qs = new URLSearchParams(event.queryStringParameters || {});
    const item_name = (qs.get("item_name") || "Curso de Edunancial").slice(0, 127);
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
