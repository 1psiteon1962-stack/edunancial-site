/* pricing-config.js — Edunancial plans (EN/ES) with Monthly/Annual pricing.
   - Basic (free)
   - Gold (paid)
   - Annual shows “per month” AND the billed-yearly total in UI (handled by region-pricing.js)
*/

window.EDN_PLANS = [
  {
    id: "basic",
    name: { en: "Basic", es: "Básico" },
    monthly: 0,
    annual: 0,             // billed yearly total; 0 stays 0
    features: {
      en: [
        "Access to public lessons (EN/ES)",
        "Starter templates (budget & savings)",
        "Community tips",
        "Free pamphlet download",
        "No discounts on store/events"
      ],
      es: [
        "Acceso a lecciones públicas (EN/ES)",
        "Plantillas iniciales (presupuesto y ahorro)",
        "Consejos de la comunidad",
        "Folleto gratuito (descarga)",
        "Sin descuentos en tienda/eventos"
      ]
    },
    cta: { en: "Start free", es: "Comienza gratis" },
    href: "contact.html"
  },
  {
    id: "gold",
    name: { en: "Gold", es: "Oro" },
    monthly: 12,           // default monthly price
    annual: 108,           // billed yearly total (2 months free)
    features: {
      en: [
        "Everything in Basic",
        "Full lesson library + investing primers",
        "Specials & member discounts",
        "Early-bird access to new lessons/events",
        "Monthly Q&A / office hours",
        "Extra templates (net worth, sinking funds, pay-yourself-first)",
        "Free pamphlet download",
        "Priority support"
      ],
      es: [
        "Todo en Básico",
        "Biblioteca completa + introducción a inversión",
        "Ofertas y descuentos para miembros",
        "Acceso anticipado a nuevas lecciones/eventos",
        "Sesión mensual de preguntas y respuestas",
        "Plantillas extra (patrimonio, fondos, páguese primero)",
        "Folleto gratuito (descarga)",
        "Soporte prioritario"
      ]
    },
    cta: { en: "Join Gold", es: "Unirte a Oro" },
    href: "contact.html" // replace with Square checkout later
  }
];

/* Optional silent regional pricing adjustments (no “Region” label shown).
   Return an object keyed by plan id; each value can include { monthly, annual } overrides.
   Example below: Puerto Rico lower price for Gold.
*/
window.EDN_PRICE_OVERRIDES = function (countryCode, stateCode) {
  const adj = {};
  if (countryCode === "US" && stateCode === "PR") {
    adj.gold = { monthly: 9, annual: 90 };
  }
  return adj;
};
