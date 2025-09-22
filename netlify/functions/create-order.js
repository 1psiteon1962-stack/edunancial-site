// Creates a PayPal order for the exact discounted cart total
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

exports.handler = async (event) => {
  try {
    if(event.httpMethod !== "POST") return resp(405, "Method Not Allowed");
    const { cart, age, promo, email } = JSON.parse(event.body || "{}");
    if(!Array.isArray(cart) || cart.length===0) return resp(400, "Empty cart");
    if(!email) return resp(400, "Email required");

    // SAME catalog as in client (keep in sync)
    const PRODUCTS = {
      "EDN-CRS-MIX-001": { price:75, name:"Edunancial Mini Course" },
      "B-RED-1": { price:19, name:"Real Estate Basics (Red 1)" },
      "B-RED-2": { price:29, name:"Tax Liens & Deeds (Red 2)" },
      "B-WHT-1": { price:17, name:"Paper Assets 101 (White 1)" },
      "B-WHT-2": { price:21, name:"Investing Frameworks (White 2)" },
      "B-BLU-1": { price:18, name:"Start a Simple Business (Blue 1)" },
      "B-BLU-2": { price:24, name:"Business Systems (Blue 2)" },
      "B-BLU-3": { price:16, name:"Sales & Habits (Blue 3)" },
      "B-MIX-1": { price:15, name:"Foundations Workbook" }
    };
    const DISCOUNT_PRICE_PER_ITEM = 1;

    const normalizeCode = s => (s||"").toUpperCase().replace(/\s+/g,"");
    const code = normalizeCode(promo);
    const validCode = /^PR[0-9]+(\${2,3})$/.test(code);
    const under18Only = validCode && code.endsWith("$$$");
    const discountAllowed = validCode && (!under18Only || age === "under18");

    // compute total and line items
    let total = 0;
    let items = [];
    for(const row of cart){
      const p = PRODUCTS[row.id]; if(!p) continue;
      const qty = Math.max(1, Number(row.qty||1));
      const unit = discountAllowed ? DISCOUNT_PRICE_PER_ITEM : p.price;
      total += unit * qty;
      items.push({ name:p.name, sku: row.id, unit_amount:{ currency_code:"USD", value: unit.toFixed(2) }, quantity: String(qty) });
    }
    if(total <= 0) return resp(400, "Invalid total");

    // Store buyer email for capture step
    const meta = Buffer.from(JSON.stringify({ email })).toString("base64url");

    // PayPal access token
    const token = await getAccessToken();

    // Create order
    const createRes = await fetch("https://api-m.paypal.com/v2/checkout/orders", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "Authorization":`Bearer ${token}`
      },
      body: JSON.stringify({
        intent:"CAPTURE",
        purchase_units:[{
          custom_id: meta,
          amount:{
            currency_code:"USD",
            value: total.toFixed(2),
            breakdown:{
              item_total:{ currency_code:"USD", value: total.toFixed(2) }
            }
          },
          items
        }]
      })
    });

    if(!createRes.ok){
      const t = await createRes.text();
      return resp(createRes.status, t);
    }
    const json = await createRes.json();
    return resp(200, JSON.stringify({ id: json.id }));
  } catch(err){
    return resp(500, err.message || "Server error");
  }
};

function resp(status, body){ return { statusCode: status, body }; }

async function getAccessToken(){
  const id = process.env.PAYPAL_CLIENT_ID;
  const sec = process.env.PAYPAL_CLIENT_SECRET;
  const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method:"POST",
    headers:{ "Content-Type":"application/x-www-form-urlencoded",
              "Authorization":"Basic " + Buffer.from(id + ":" + sec).toString("base64") },
    body:"grant_type=client_credentials"
  });
  const j = await res.json();
  if(!res.ok) throw new Error(j.error_description || "token failure");
  return j.access_token;
}
