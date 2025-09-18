// File: netlify/functions/es-paypal-redirect.js
// Purpose: Redirección a PayPal Standard (_xclick) con cálculos en el servidor (versión ES)

exports.handler = async (event) => {
  // ★ Usa tu Merchant ID de PayPal (más seguro que exponer el email)
  const BUSINESS = "YOUR_PAYPAL_MERCHANT_ID"; // <-- pon aquí tu Merchant ID

  // URLs del sitio (ES)
  const SITE = "https://www.edunancial.com";
  const RETURN_URL = `${SITE}/es-thank-you.html`;   // página de gracias (ES)
  const CANCEL_URL = `${SITE}/es-payments.html`;    // página de pagos/cancelación (ES)

  // Early-bird
  const EARLY_BIRD_DEADLINE = new Date("2025-09-26T23:59:59-05:00");
  const EARLY_BIRD_PCT = 0.15;

  // Descuentos por membresía (acepta alias en ES)
  const MEMBERSHIP_DISCOUNTS = {
    none: 0,        // ninguna
    basic: 0.05,    // básica
    plus: 0.10,     // plus
    pro: 0.20,      // pro
  };

  // Catálogo (ES). Los SKU se mantienen iguales.
  const CATALOG = {
    "EDN-MINI-EM-001": { name: "Mini Curso: Método Edunancial", price: 75.0 },
    // agrega más SKUs aquí si los necesitas
  };

  // Lee parámetros
  const q = event.queryStringParameters || {};
  const sku = (q.sku || "EDN-MINI-EM-001").trim();

  // Normaliza membresía (acepta términos en ES)
  const rawMembership = (q.membership || "none").toLowerCase();
  const membership = normalizeMembership(rawMembership);

  const isMinor = q.minor === "1" || q.minor === "true"; // “Soy menor de 18”
  const code = (q.code || "").trim();                    // código de descuento

  // Verifica SKU
  const item = CATALOG[sku];
  if (!item) {
    return { statusCode: 400, body: `SKU desconocido: ${sku}` };
    }

  // Precio base
  let total = item.price;

  // Descuento por membresía
  const memPct = MEMBERSHIP_DISCOUNTS[membership] || 0;
  total = round2(total * (1 - memPct));

  // Early-bird
  if (new Date() <= EARLY_BIRD_DEADLINE) {
    total = round2(total * (1 - EARLY_BIRD_PCT));
  }

  // Código de prueba oculto (no aparece en el HTML de la página)
  if (code === "PR12345$$") {
    total = 1.0;
  }

  // Seguridad: mínimo
  if (total < 0.5) total = 0.5;

  // Construye URL de PayPal
  const params = new URLSearchParams({
    cmd: "_xclick",
    business: BUSINESS,
    item_name: item.name,
    item_number: sku,
    amount: total.toFixed(2),
    currency_code: "USD",
    return: RETURN_URL,
    cancel_return: CANCEL_URL,
    // Guarda metadatos útiles (no sensibles)
    custom: JSON.stringify({
      sku,
      membership,
      isMinor,
      hadCode: Boolean(code),
      ts: Date.now(),
      lang: "es",
    }),
    no_shipping: "1",
  });

  const paypalURL = `https://www.paypal.com/cgi-bin/webscr?${params.toString()}`;

  return {
    statusCode: 302,
    headers: { Location: paypalURL },
    body: "",
  };
};

// Helpers
function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function normalizeMembership(val) {
  // Admite valores en ES e inglés
  const map = {
    "ninguna": "none",
    "none": "none",

    "basica": "basic",
    "básica": "basic",
    "basic": "basic",

    "plus": "plus",

    "pro": "pro",
  };
  return map[val] || "none";
}
