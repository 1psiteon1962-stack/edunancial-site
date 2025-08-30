<script>
// -------- EDIT THESE VALUES ONLY --------
window.EDU_PRICING_CONFIG = {
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
  // Optional Bitcoin links; leave blank to hide the BTC button for that region/plan
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
