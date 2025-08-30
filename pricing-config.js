<script>
// -------- EDIT THESE VALUES ONLY --------
window.EDU_PRICING_CONFIG = {
  // HERO (bilingual marketing copy)
  hero: {
    headline: {
      en: "Financial literacy for everyone — bilingual and practical",
      es: "Educación financiera para todos — bilingüe y práctica"
    },
    paragraph: {
      en: "Learn money skills the clear way: budgeting, credit, investing, and business basics. Membership includes lessons, templates, and community — with region-based pricing.",
      es: "Aprende sobre dinero de manera clara: presupuestos, crédito, inversiones y fundamentos de negocios. La membresía incluye lecciones, plantillas y comunidad — con precios según la región."
    },
    ctaPrimary: { en: "View Plans", es: "Ver planes" },
    ctaSecondary: { en: "How Edunancial started", es: "Cómo comenzó Edunancial" }
  },

  // Pricing + regions
  currencyByRegion: {
    US: "USD", PR: "USD", DO: "USD", MX: "MXN", CA: "CAD", EU: "EUR", ROW: "USD"
  },
  display: {
    BASIC: {
      name: { en: "Basic", es: "Básico" },
      prices: { US: 5.00, PR: 5.00, DO: 5.00, MX: 89, CA: 7.00, EU: 5.00, ROW: 5.00 }
    },
    PREMIUM: {
      name: { en: "Premium", es: "Premium" },
      prices: { US: 15.00, PR: 15.00, DO: 15.00, MX: 269, CA: 19.00, EU: 15.00, ROW: 15.00 }
    },
    LIFETIME: {
      name: { en: "Lifetime", es: "De por vida" },
      prices: { US: 199.00, PR: 199.00, DO: 199.00, MX: 3699, CA: 259.00, EU: 199.00, ROW: 199.00 }
    }
  },
  checkoutLinks: {
    BASIC:  { US:"https://square.link/u/your-basic-us",  PR:"", DO:"", MX:"", CA:"", EU:"", ROW:"" },
    PREMIUM:{ US:"https://square.link/u/your-premium-us",PR:"", DO:"", MX:"", CA:"", EU:"", ROW:"" },
    LIFETIME:{US:"https://square.link/u/your-lifetime-us",PR:"", DO:"", MX:"", CA:"", EU:"", ROW:"" }
  },
  // Optional Bitcoin links; leave blank to hide the BTC button
  cryptoLinks: {
    BASIC:   { US:"", PR:"", DO:"", MX:"", CA:"", EU:"", ROW:"" },
    PREMIUM: { US:"", PR:"", DO:"", MX:"", CA:"", EU:"", ROW:"" },
    LIFETIME:{ US:"", PR:"", DO:"", MX:"", CA:"", EU:"", ROW:"" }
  },
  labels: {
    regionLabel: { en: "Region", es: "Región" },
    change:      { en: "Change", es: "Cambiar" },
    perMonth:    { en: "/month", es: "/mes" },
    selectPlan:  { en: "Select", es: "Elegir" }
  }
};
// -------- END EDIT ZONE --------
</script>
