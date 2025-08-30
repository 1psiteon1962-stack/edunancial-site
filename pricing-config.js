<script>
// -------- EDIT THESE VALUES ONLY --------
window.EDU_PRICING_CONFIG = {
  currencyByRegion: {
    US: "USD",
    PR: "USD",
    DO: "USD",
    MX: "MXN",
    CA: "CAD",
    EU: "EUR",
    ROW: "USD" // Rest of world
  },
  // Display prices (shown on website)
  display: {
    // Plan IDs are your internal handles. Reuse these in HTML data attributes.
    BASIC: {
      name: { en: "Basic", es: "Básico" },
      prices: {
        US: 5.00, PR: 5.00, DO: 5.00,
        MX: 89, CA: 7.00, EU: 5.00, ROW: 5.00
      }
    },
    PREMIUM: {
      name: { en: "Premium", es: "Premium" },
      prices: {
        US: 15.00, PR: 15.00, DO: 15.00,
        MX: 269, CA: 19.00, EU: 15.00, ROW: 15.00
      }
    },
    LIFETIME: {
      name: { en: "Lifetime", es: "De por vida" },
      prices: {
        US: 199.00, PR: 199.00, DO: 199.00,
        MX: 3699, CA: 259.00, EU: 199.00, ROW: 199.00
      }
    }
  },
  // Square Checkout Links per region + plan
  // Create a checkout link in your Square dashboard for each region/plan,
  // then paste the URLs here. Fallback to ROW if a region link is missing.
  checkoutLinks: {
    BASIC: {
      US: "https://square.link/u/your-basic-us",
      PR: "https://square.link/u/your-basic-pr",
      DO: "https://square.link/u/your-basic-do",
      MX: "https://square.link/u/your-basic-mx",
      CA: "https://square.link/u/your-basic-ca",
      EU: "https://square.link/u/your-basic-eu",
      ROW: "https://square.link/u/your-basic-row"
    },
    PREMIUM: {
      US: "https://square.link/u/your-premium-us",
      PR: "https://square.link/u/your-premium-pr",
      DO: "https://square.link/u/your-premium-do",
      MX: "https://square.link/u/your-premium-mx",
      CA: "https://square.link/u/your-premium-ca",
      EU: "https://square.link/u/your-premium-eu",
      ROW: "https://square.link/u/your-premium-row"
    },
    LIFETIME: {
      US: "https://square.link/u/your-lifetime-us",
      PR: "https://square.link/u/your-lifetime-pr",
      DO: "https://square.link/u/your-lifetime-do",
      MX: "https://square.link/u/your-lifetime-mx",
      CA: "https://square.link/u/your-lifetime-ca",
      EU: "https://square.link/u/your-lifetime-eu",
      ROW: "https://square.link/u/your-lifetime-row"
    }
  },
  // Labels
  labels: {
    regionLabel: { en: "Region", es: "Región" },
    change: { en: "Change", es: "Cambiar" },
    perMonth: { en: "/month", es: "/mes" },
    selectPlan: { en: "Select", es: "Elegir" }
  }
};
// -------- END EDIT ZONE --------
</script>
