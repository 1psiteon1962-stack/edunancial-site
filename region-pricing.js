<script>
(function(){
  const CFG = window.EDU_PRICING_CONFIG;

  // Helpers
  const getCookie = (name) => {
    const m = document.cookie.match(new RegExp('(^| )'+name+'=([^;]+)'));
    return m ? decodeURIComponent(m[2]) : null;
  };
  const setCookie = (name, val, days=365) => {
    const max = days*24*60*60;
    document.cookie = `${name}=${encodeURIComponent(val)}; Path=/; Max-Age=${max}; SameSite=Lax`;
  };
  const storage = window.localStorage;
  const $ = (s,root=document)=>root.querySelector(s);
  const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));

  function guessRegion() {
    // 1) Edge cookie if present
    const edge = getCookie("eduregion");
    if (edge) return edge;

    // 2) Browser language hint
    const lang = (navigator.language || "en-US").toUpperCase();
    if (lang.includes("-US")) return "US";
    if (lang.includes("-PR")) return "PR";
    if (lang.startsWith("ES-")) return "DO"; // Spanish – default to DO for LatAm unless overridden
    if (lang.startsWith("FR-") || lang.startsWith("DE-") || lang.startsWith("IT-") || lang.startsWith("ES-") || lang.startsWith("PT-")) return "EU";

    return "ROW";
  }

  function getLang() {
    // Match your site’s language toggle (default EN)
    return (storage.getItem("edu_lang") || document.documentElement.lang || "en").slice(0,2);
  }

  function currencyFor(region) {
    return CFG.currencyByRegion[region] || "USD";
  }

  function formatMoney(amount, currency, locale='en-US') {
    try {
      return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);
    } catch (_e) {
      return `${currency} ${amount}`;
    }
  }

  function currentRegion() {
    return storage.getItem("edu_region") || getCookie("eduregion") || guessRegion();
  }

  function setRegion(region, pinned=true) {
    storage.setItem("edu_region", region);
    setCookie("eduregion", region);
    if (pinned) setCookie("eduregion_pinned", "1");
    render();
  }

  function setLang(lang) {
    storage.setItem("edu_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    render();
  }

  // Expose for buttons
  window.EDU_UI = { setRegion, setLang };

  function render() {
    const region = currentRegion();
    const lang = getLang();
    const currency = currencyFor(region);
    const locale = lang === "es" ? "es-ES" : "en-US";

    // Update region label
    const regionLabelEl = $("#region-label");
    const changeBtn = $("#region-change-btn");
    if (regionLabelEl) {
      regionLabelEl.textContent = (CFG.labels.regionLabel[lang] || CFG.labels.regionLabel.en) + ": " + region;
    }
    if (changeBtn) {
      changeBtn.textContent = CFG.labels.change[lang] || CFG.labels.change.en;
    }

    // Update plan cards
    $$("[data-plan]").forEach(card => {
      const planId = card.getAttribute("data-plan");
      const plan = CFG.display[planId];
      if (!plan) return;

      const nameEl = card.querySelector("[data-plan-name]");
      const priceEl = card.querySelector("[data-plan-price]");
      const perEl = card.querySelector("[data-plan-per]");
      const btnEl = card.querySelector("[data-plan-select]");

      if (nameEl) nameEl.textContent = plan.name[lang] || plan.name.en;

      const raw = plan.prices[region] ?? plan.prices.ROW;
      if (priceEl) priceEl.textContent = formatMoney(raw, currency, locale);
      if (perEl) perEl.textContent = CFG.labels.perMonth[lang] || CFG.labels.perMonth.en;

      // Checkout links by region with fallback
      const links = CFG.checkoutLinks[planId] || {};
      const href = links[region] || links.ROW || "#";
      if (btnEl) {
        btnEl.textContent = CFG.labels.selectPlan[lang] || CFG.labels.selectPlan.en;
        btnEl.setAttribute("href", href);
      }
    });

    // Language toggles (optional)
    $$("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      const parts = key.split(".");
      let ref = CFG.labels;
      for (const p of parts) ref = ref?.[p];
      if (typeof ref === "string") el.textContent = ref;
      else if (ref && typeof ref === "object") el.textContent = ref[lang] || ref.en || "";
    });
  }

  // Region picker modal (very lightweight)
  function initRegionPicker() {
    const picker = $("#region-picker");
    if (!picker) return;

    picker.addEventListener("click", (e) => {
      const r = e.target.closest("[data-region]");
      if (r) {
        setRegion(r.getAttribute("data-region"));
        picker.open = false;
      }
    });

    const change = $("#region-change-btn");
    if (change) change.addEventListener("click", () => picker.open = true);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initRegionPicker();
    render();
  });
})();
</script>
