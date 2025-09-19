// /.netlify/functions/paypal-redirect.js
// Node 18+ Netlify function
exports.handler = async (event) => {
  try {
    const params = new URLSearchParams(event.rawQuery || "");
    const sku = (params.get("sku") || "").toUpperCase();

    // --- SET THIS ONCE (stays server-side) ---
    // Your PayPal merchant email (or Merchant ID) used for Standard Checkout
    const BUSINESS = "1psiteon1962@gmail.com"; // safe to keep here; never appears in your HTML

    // --- Product catalog (extend anytime) ---
    const items = {
      // Membership
      "EDN-MEM-001": { name: "Edunancial Membership (Monthly)", amount: "5.00" },

      // Courses
      "EDN-CRS-MIX-001": { name: "The Edunancial Method — Mini Course", amount: "75.00" },
      "EDN-CRS-BO-001":  { name: "In-Depth Business Formation", amount: "199.00" },

      // Books
      "EDN-BK-RE-001": { name: "Buying and Flipping Houses for Profit (Print)", amount: "18.99" },
      "EDN-BK-PA-001": { name: "Options Trading — Puts, Calls & Strategy (Print)", amount: "18.99" },
      "EDN-BK-BO-001": { name: "Business is About Making Profit (Print)", amount: "18.99" },
    };

    const item = items[sku];
    if (!item) {
      return { statusCode: 302, headers: { Location: "/checkout.html?error=invalid_sku" } };
    }

    // Classic, reliable PayPal Standard “Buy Now” link (server builds it; page never shows secrets)
    const p = new URLSearchParams({
      cmd: "_xclick",
      business: BUSINESS,
      item_name: item.name,
      amount: item.amount,
      currency_code: "USD",
      // Optional: send the SKU back to your Thank You page
      custom: sku,
      // Where PayPal returns after payment / cancel (these are your existing pages)
      return: "https://www.edunancial.com/thank-you.html",
      cancel_return: "https://www.edunancial.com/checkout.html?status=cancel",
      // BN code helps PayPal analytics; harmless to keep
      bn: "PP-BuyNowBF:btn_buynowCC_LG.gif:NonHostedGuest"
    });

    const url = `https://www.paypal.com/cgi-bin/webscr?${p.toString()}`;
    return { statusCode: 302, headers: { Location: url } };
  } catch (e) {
    return { statusCode: 302, headers: { Location: "/checkout.html?error=server" } };
  }
};
