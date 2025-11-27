// File: assets/js/pricing.js

(function () {
  function formatPrice(symbol, amount) {
    // Simple formatting; can be replaced with Intl.NumberFormat later
    return symbol + amount.toString();
  }

  function applyRegionPricing() {
    if (!window.EdunancialRegion) return;

    const { symbol, plans } = window.EdunancialRegion;

    // Update any visible "current region" label
    const regionLabelEl = document.querySelector("[data-current-region]");
    if (regionLabelEl) {
      const key = window.EdunancialRegion.key;
      const labelMap = {
        global: "Global",
        us: "United States & Canada",
        latam: "Latinoamérica",
        africa: "África",
        eu: "Europa"
      };
      regionLabelEl.textContent = labelMap[key] || "Global";
    }

    // Detect whether the page is using monthly or annual prices
    const billingToggle = document.querySelector("[data-billing-toggle]");
    let billingMode = "monthly";

    if (billingToggle) {
      billingToggle.addEventListener("change", function (e) {
        billingMode = e.target.checked ? "annual" : "monthly";
        updateAllPlans();
      });
    }

    function updateAllPlans() {
      const planEls = document.querySelectorAll("[data-plan-id]");

      planEls.forEach(function (planEl) {
        const planId = planEl.getAttribute("data-plan-id");
        const planConfig = plans[planId];
        if (!planConfig) return;

        const priceEl = planEl.querySelector("[data-plan-price]");
        const periodEl = planEl.querySelector("[data-plan-period]");

        if (priceEl) {
          const amount = planConfig[billingMode];
          priceEl.textContent = formatPrice(symbol, amount);
        }

        if (periodEl) {
          periodEl.textContent =
            billingMode === "annual" ? "/año" : "/mes";
        }
      });
    }

    updateAllPlans();
  }

  document.addEventListener("DOMContentLoaded", applyRegionPricing);
})();
