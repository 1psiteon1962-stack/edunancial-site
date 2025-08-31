/* pricing-config.js — simple plan catalog (no provider links yet) */
window.EDN_PLANS = [
  {
    id: "basic",
    name: { en: "Basic", es: "Básico" },
    price: 0,
    term: { en: "/month", es: "/mes" },
    features: {
      en: ["Intro lessons (EN/ES)", "Templates: budget & savings", "Community tips"],
      es: ["Lecciones intro (EN/ES)", "Plantillas: presupuesto y ahorro", "Consejos de la comunidad"]
    },
    cta: { en: "Start free", es: "Comienza gratis" },
    href: "contact.html"
  },
  {
    id: "core",
    name: { en: "Core", es: "Esencial" },
    price: 7,
    term: { en: "/month", es: "/mes" },
    features: {
      en: ["Full lesson library", "Investing primers", "Goal tracking"],
      es: ["Biblioteca completa", "Introducción a inversión", "Seguimiento de metas"]
    },
    cta: { en: "Get started", es: "Empezar" },
    href: "contact.html"
  },
  {
    id: "plus",
    name: { en: "Plus", es: "Plus" },
    price: 12,
    term: { en: "/month", es: "/mes" },
    features: {
      en: ["Everything in Core", "Practice challenges", "Monthly Q&A"],
      es: ["Todo Esencial", "Retos de práctica", "Preguntas y respuestas mensuales"]
    },
    cta: { en: "Join now", es: "Únete" },
    href: "contact.html"
  }
];

/* Optional regional adjustments (silent; no “Region” label shown) */
window.EDN_PRICE_OVERRIDES = function (countryCode /* e.g., 'US' */, stateCode /* e.g., 'TX' */) {
  // Example: lower price in PR; tweak per your strategy
  const adj = {};
  if (countryCode === "US" && stateCode === "PR") {
    adj.core = 5;
    adj.plus = 9;
  }
  return adj;
};
