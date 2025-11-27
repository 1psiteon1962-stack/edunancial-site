// File: assets/js/region-config.js

(function () {
  /**
   * Basic per-region pricing configuration.
   * Adjust these numbers without touching HTML.
   */
  const REGION_PRICING = {
    us: {
      currency: "USD",
      symbol: "$",
      plans: {
        // IDs must match data-plan-id in pricing.html
        starter: {
          monthly: 19,
          annual: 190
        },
        growth: {
          monthly: 49,
          annual: 490
        },
        pro: {
          monthly: 99,
          annual: 990
        }
      }
    },
    latam: {
      currency: "MXN",
      symbol: "$",
      plans: {
        starter: {
          monthly: 199,
          annual: 1990
        },
        growth: {
          monthly: 499,
          annual: 4990
        },
        pro: {
          monthly: 999,
          annual: 9990
        }
      }
    },
    africa: {
      currency: "USD",
      symbol: "$",
      plans: {
        starter: {
          monthly: 5,
          annual: 50
        },
        growth: {
          monthly: 9,
          annual: 90
        },
        pro: {
          monthly: 15,
          annual: 150
        }
      }
    },
    eu: {
      currency: "EUR",
      symbol: "€",
      plans: {
        starter: {
          monthly: 29,
          annual: 290
        },
        growth: {
          monthly: 79,
          annual: 790
        },
        pro: {
          monthly: 149,
          annual: 1490
        }
      }
    },
    global: {
      currency: "USD",
      symbol: "$",
      plans: {
        starter: {
          monthly: 19,
          annual: 190
        },
        growth: {
          monthly: 49,
          annual: 490
        },
        pro: {
          monthly: 99,
          annual: 990
        }
      }
    }
  };

  /**
   * Map hostname → region key.
   * Keep in sync with site-config.json
   */
  const DOMAIN_MAP = {
    "edunancial.com": "global",
    "www.edunancial.com": "global",
    "edunancial.us": "us",
    "www.edunancial.us": "us",
    "edunancial.lat": "latam",
    "www.edunancial.lat": "latam",
    "edunancial.africa": "africa",
    "www.edunancial.africa": "africa",
    "edunancial.eu": "eu",
    "www.edunancial.eu": "eu"
  };

  const hostname = (window.location.hostname || "").toLowerCase();
  const regionKey = DOMAIN_MAP[hostname] || "global";
  const regionConfig = REGION_PRICING[regionKey] || REGION_PRICING.global;

  // Expose a single global object
  window.EdunancialRegion = {
    key: regionKey,
    currency: regionConfig.currency,
    symbol: regionConfig.symbol,
    plans: regionConfig.plans
  };
})();
