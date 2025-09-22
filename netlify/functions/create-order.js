// Create PayPal order with itemized cart + discount handling
import fetch from "node-fetch";

const PP_BASE = "https://api-m.paypal.com"; // LIVE
const CLIENT = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

// Example discount code map (server-side source of truth)
const CODES = {
  "PR12345$$$": { type: "fixed", amount: 72.00 }, // $75 -> $3
  "U18-001":    { type: "fixed", amount: 74.00 }, // $75 -> $1
  // add more as needed
};

function round2(n){ return Math.round(n*100)/100; }

async function getAccessToken(){
  const res = await fetch(`${PP_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
    auth: `${CLIENT}:${SECRET}` // node-fetch supports basic auth via option below:
  });
  // Older node-fetch doesn’t support auth option; do manual header:
  // headers: { Authorization: 'Basic ' + Buffer.from(`${CLIENT}:${SECRET}`).toString('base64'), ...
  if (!res.ok){
    throw new Error("Auth fail " + res.status);
  }
  const j = await res.json();
  return j.access_token;
}

export async function handler(event){
  try{
    const { items=[], discountCode="", buyerEmail="" } = JSON.parse(event.body||"{}");

    if (!Array.isArray(items) || !items.length){
      return { statusCode: 400, body: JSON.stringify({ error: "No items" }) };
    }

    // Calculate totals
    let total = 0;
    const ppItems = items.map(i=>{
      const unit = parseFloat(i.unitPrice);
      const qty  = parseInt(i.quantity,10);
      const sub  = round2(unit * qty);
      total += sub;
      return {
        name: i.name.slice(0,126),
        sku: i.id,
        quantity: String(qty),
        unit_amount: { currency_code: "USD", value: unit.toFixed(2) },
        category: "DIGITAL_GOODS"
      };
    });

    // Apply discount (server-side!)
    let discount = 0;
    const codeKey = (discountCode || "").replace(/\s+/g,"");
    if (codeKey && CODES[codeKey]){
      const cfg = CODES[codeKey];
      if (cfg.type === "fixed") discount = Math.min(total, round2(cfg.amount));
      if (cfg.type === "percent") discount = round2(total * (cfg.percent/100));
    }
    const grand = round2(total - discount);

    // Build purchase unit
    const purchase_unit = {
      amount: {
        currency_code: "USD",
        value: grand.toFixed(2),
        breakdown: {
          item_total: { currency_code: "USD", value: total.toFixed(2) },
          discount:   { currency_code: "USD", value: discount.toFixed(2) }
        }
      },
      items: ppItems
    };

    // Create order
    const access = await getAccessToken();
    const res = await fetch(`${PP_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${access}`
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [purchase_unit],
        payer: buyerEmail ? { email_address: buyerEmail } : undefined,
        application_context: {
          brand_name: "Edunancial, Inc",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          shipping_preference: "NO_SHIPPING",
          return_url: "https://edunancial.com/thank-you.html",
          cancel_url: "https://edunancial.com/cart.html"
        }
      })
    });
    const data = await res.json();
    if (!res.ok){ return { statusCode: res.status, body: JSON.stringify(data) }; }
    return { statusCode: 200, body: JSON.stringify({ id: data.id }) };
  } catch (e){
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
}
