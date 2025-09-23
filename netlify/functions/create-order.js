// /netlify/functions/create-order.js
// Fully self-contained PayPal order creator with discount-code handling
// Works for memberships AND normal cart checkouts.
// -------------------------------------------------------------

const fetch = require("node-fetch");

// ---- CONFIG --------------------------------------------------
// Set these in Netlify environment vars (Site settings → Build & deploy → Environment)
// or load from your existing ./netlify/functions/config.js if you prefer.
const PAYPAL_CLIENT_ID  = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET     = process.env.PAYPAL_SECRET;
const PAYPAL_ENV        = (process.env.PAYPAL_ENV || "live").toLowerCase(); // "live" | "sandbox"
const PAYPAL_API_BASE   = PAYPAL_ENV === "sandbox"
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com";

const DEFAULT_CURRENCY = "USD";

// Membership catalog (keep SKUs & base prices here)
const MEMBERSHIP_CATALOG = {
  STARTER: { sku: "EDN-MEM-STARTER-001", name: "Starter Membership", basePrice: 5.00 },
  GROWTH : { sku: "EDN-MEM-GROWTH-001",  name: "Growth Membership",  basePrice: 15.00 },
  PRO    : { sku: "EDN-MEM-PRO-001",     name: "Pro Membership",     basePrice: 25.00 },
};

// Example discount codes.
// You can add/edit codes without touching the rest of the logic.
// Modes:
//  - "percent"                => % off total (0.25 = 25%)
//  - "flat"                   => flat $ off total (5 = $5 off)
//  - "fixed_total"            => force entire total to a fixed dollar amount
//  - "fixed_price_per_item"   => set each qualifying item to this exact price
//
// You can also scope a code to specific SKUs or to categories you pass on items.
const DISCOUNT_CODES = {
  // Membership promo: 20% off any membership
  "EDUNANCIAL2025": { mode: "percent", value: 0.20, appliesTo: { type: "membership" } },

  // Non-profit / youth program: each qualifying cart item (books/courses) is $1.00
  "COMMUNITY$1": { mode: "fixed_price_per_item", value: 1.00, appliesTo: { categories: ["book", "course"] } },

  // Mini course special: total becomes $3 if the mini-course SKU is the only item
  "PR12345$$$": { mode: "fixed_total", value: 3.00, appliesTo: { skus: ["EDN-CRS-MIX-001"] } },
};

// ---- HELPERS -------------------------------------------------

function currency(v) {
  return Number.parseFloat(v).toFixed(2);
}

function safeGet(obj, path, dflt) {
  return path.split(".").reduce((o, k) => (o && k in o ? o[k] : dflt), obj);
}

// Apply a discount code to items + subtotal
// items: [{name, sku, unit_amount, quantity, category}, ...]
// returns { items: [...maybe adjusted...], totalAfter, discountApplied, details }
function applyDiscount({ code, items, subtotal, isMembershipOrder }) {
  if (!code) return { items, totalAfter: subtotal, discountApplied: 0, details: "No code" };

  const rule = DISCOUNT_CODES[code.toUpperCase()];
  if (!rule) return { items, totalAfter: subtotal, discountApplied: 0, details: "Code not found" };

  // Scope check
  function itemQualifies(it) {
    // Type scope
    if (rule.appliesTo?.type) {
      if (rule.appliesTo.type === "membership") return isMembershipOrder === true;
      if (rule.appliesTo.type === "cart")        return !isMembershipOrder;
    }
    // SKU scope
    if (rule.appliesTo?.skus && rule.appliesTo.skus.length) {
      return rule.appliesTo.skus.includes(it.sku);
    }
    // Category scope
    if (rule.appliesTo?.categories && rule.appliesTo.categories.length) {
      return it.category && rule.appliesTo.categories.includes(it.category);
    }
    // If no scope defined, applies to everything
    return true;
  }

  let newItems = items.map(i => ({ ...i }));
  let newSubtotal = subtotal;
  let discountApplied = 0;

  switch (rule.mode) {
    case "percent": {
      if (isMembershipOrder) {
        discountApplied = subtotal * rule.value;
        newSubtotal = subtotal - discountApplied;
      } else {
        // cart: apply percent only to qualifying lines
        let qualTotal = 0;
        newItems.forEach(it => {
          if (itemQualifies(it)) {
            const line = it.unit_amount * it.quantity;
            qualTotal += line;
          }
        });
        discountApplied = qualTotal * rule.value;
        newSubtotal = subtotal - discountApplied;
      }
      break;
    }

    case "flat": {
      discountApplied = Math.min(rule.value, subtotal);
      newSubtotal = subtotal - discountApplied;
      break;
    }

    case "fixed_total": {
      // If SKU scope present: only force fixed total when all items qualify
      if (rule.appliesTo?.skus?.length) {
        const allQualify =
          newItems.length > 0 &&
          newItems.every(it => rule.appliesTo.skus.includes(it.sku));
        if (!allQualify) {
          return { items, totalAfter: subtotal, discountApplied: 0, details: "Not applicable to this combination" };
        }
      }
      newSubtotal = Math.max(0, rule.value);
      discountApplied = subtotal - newSubtotal;
      break;
    }

    case "fixed_price_per_item": {
      // For each qualifying item, set unit price to rule.value
      let adjusted = 0;
      newItems = newItems.map(it => {
        if (!itemQualifies(it)) return it;
        const originalLine = it.unit_amount * it.quantity;
        const newLine = (rule.value * it.quantity);
        adjusted += (originalLine - newLine);
        return { ...it, unit_amount: rule.value };
      });
      discountApplied = adjusted;
      newSubtotal = subtotal - discountApplied;
      break;
    }

    default:
      // Unsupported mode – ignore
      return { items, totalAfter: subtotal, discountApplied: 0, details: "Unsupported mode" };
  }

  if (newSubtotal < 0) newSubtotal = 0;

  return {
    items: newItems,
    totalAfter: newSubtotal,
    discountApplied,
    details: "Applied",
  };
}

async function getPayPalAccessToken() {
  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal OAuth failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function createPayPalOrder({ items, total, currency_code, returnUrl, cancelUrl, customer }) {
  const access = await getPayPalAccessToken();

  // Build item breakdown for PayPal (all amounts as strings)
  const purchaseItems = items.map(it => ({
    name: it.name,
    sku: it.sku,
    quantity: String(it.quantity),
    unit_amount: { currency_code, value: currency(it.unit_amount) },
    category: it.category === "book" || it.category === "course" ? "DIGITAL_GOODS" : "PHYSICAL_GOODS",
  }));

  const body = {
    intent: "CAPTURE",
    purchase_units: [{
      amount: {
        currency_code,
        value: currency(total),
        breakdown: {
          item_total: { currency_code, value: currency(items.reduce((a, it) => a + (it.unit_amount * it.quantity), 0)) }
        }
      },
      items: purchaseItems
    }],
    application_context: {
      brand_name: "Edunancial, Inc",
      shipping_preference: "NO_SHIPPING",
      user_action: "PAY_NOW",
      return_url: returnUrl,
      cancel_url: cancelUrl
    }
  };

  // Create order
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${access}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`PayPal create order failed: ${res.status} ${t}`);
  }

  const data = await res.json();
  const approveLink = (data.links || []).find(l => l.rel === "approve");
  return { id: data.id, approveUrl: approveLink?.href };
}

// ---- HANDLER -------------------------------------------------

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      return { statusCode: 500, body: "Missing PayPal credentials" };
    }

    const body = JSON.parse(event.body || "{}");

    const currency_code = (body.currency || DEFAULT_CURRENCY).toUpperCase();
    const isMembershipOrder = !!body.membership; // when present, we treat as membership flow

    // Build items
    let items = [];
    if (isMembershipOrder) {
      const tierKey = String(body.membership || "").toUpperCase(); // "STARTER" | "GROWTH" | "PRO"
      const def = MEMBERSHIP_CATALOG[tierKey];
      if (!def) return { statusCode: 400, body: "Invalid membership tier" };

      items.push({
        name: def.name,
        sku: def.sku,
        unit_amount: Number(def.basePrice),
        quantity: 1,
        category: "membership"
      });
    } else {
      // Expect body.items = [{name, sku, price, qty, category}, ...]
      const posted = Array.isArray(body.items) ? body.items : [];
      if (!posted.length) return { statusCode: 400, body: "No items" };
      items = posted.map(p => ({
        name: p.name,
        sku: p.sku,
        unit_amount: Number(p.price),
        quantity: Number(p.qty || 1),
        category: p.category || "other",
      }));
    }

    const subtotal = items.reduce((a, it) => a + (it.unit_amount * it.quantity), 0);
    const { items: discountedItems, totalAfter, discountApplied } = applyDiscount({
      code: body.code,
      items,
      subtotal,
      isMembershipOrder
    });

    const returnUrl = body.returnUrl || `${safeGet(event, "headers.origin", "") || "https://edunancial.com"}/thank-you.html`;
    const cancelUrl = body.cancelUrl || `${safeGet(event, "headers.origin", "") || "https://edunancial.com"}/cart.html`;

    const { approveUrl, id } = await createPayPalOrder({
      items: discountedItems,
      total: totalAfter,
      currency_code,
      returnUrl,
      cancelUrl,
      customer: body.customer || {}
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        orderId: id,
        approveUrl,
        total: currency(totalAfter),
        discount: currency(discountApplied),
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: `Error: ${err.message}`
    };
  }
};
