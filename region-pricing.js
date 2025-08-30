<script>
(function(){
  const CFG = window.EDU_PRICING_CONFIG;

  // ===== Feature flags =====
  const USE_SQUARE_FUNCTION = false; // flip to true when you add the Netlify function

  // ===== Helpers =====
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

  async function fetchSquarePrices(region){
    try {
      // If you add Netlify function: /netlify/functions/get-prices
      const url = `/.netlify/functions/get-prices?region=${encodeURIComponent(region)}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      return await res.json(); // { region, priceByPlan: { BASIC:{amount,currency}, ... } }
    } catch { return null; }
  }

  function guessRegion() {
    const edge = getCookie("eduregion");
    if (edge) return edge;
    const lang = (navigator.language || "en-US").toUpperCase();
    if (lang.includes("-US")) return "US";
    if (lang.includes("-PR")) return "PR";
    if (lang.startsWith("ES-")) return "DO";
    if (/^(FR|DE|IT|ES|PT)/.test(lang)) return "EU";
    return "ROW";
  }
  function getLang() {
    return (storage.getItem("edu_lang") || document.documentElement.lang || "en").slice(0,2);
  }
  function setLang(lang) {
    storage.setItem("edu_lang", lang);
    document.documentElement.setAttribute("lang", lang);
    render();
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
  function currencyFor(region) {
    return CFG.currencyByRegion[region] || "USD";
  }
  function formatMoney(amount, currency, locale='en-US') {
    try { return new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount); }
    catch { return `${currency} ${amount}`; }
  }

  // expose for HTML buttons
  window.EDU_UI = { setRegion, setLang };

  async function render() {
    const region = currentRegion();
    const lang = getLang();
    const locale = lang === "es" ? "es-ES" : "en-US";

    // Try Square function (optional)
    let squareData = null;
    if (USE_SQUARE_FUNCTION) squareData = await fetchSquarePrices(region);

    // Header labels
    const regionLabelEl = $("#region-label");
    const changeBtn = $("#region-change-btn");
    if (regionLabelEl) regionLabelEl.textContent = (CFG.labels.regionLabel[lang] || CFG.labels.regionLabel.en) + ": " + region;
    if (changeBtn) changeBtn.textContent = CFG.labels.change[lang] || CFG.labels.change.en;

    // Plan cards
    $$("[data-plan]").forEach(card => {
      const planId = card.getAttribute("data-plan");
      const plan = CFG.display[planId];
      if (!plan) return;

      const nameEl   = card.querySelector("[data-plan-name]");
      const priceEl  = card.querySelector("[data-plan-price]");
      const perEl    = card.querySelector("[data-plan-per]");
      const btnEl    = card.querySelector("[data-plan-select]");
      const cryptoEl = card.querySelector("[data-plan-crypto]");

      if (nameEl) nameEl.textContent = plan.name[lang] || plan.name.en;

      const sq = squareData?.priceByPlan?.[planId] || null;
      const currency = sq?.currency || currencyFor(region);
      const amount   = sq?.amount ?? (plan.prices[region] ?? plan.prices.ROW);

      if (priceEl) priceEl.textContent = formatMoney(amount, currency, locale);
      if (perEl)   perEl.textContent = CFG.labels.perMonth[lang] || CFG.labels.perMonth.en;

      // Square link (primary)
      const links = CFG.checkoutLinks?.[planId] || {};
      const href  = links[region] || links.ROW || "#";
      if (btnEl) {
        btnEl.textContent = CFG.labels.selectPlan[lang] || CFG.labels.selectPlan.en;
        btnEl.setAttribute("href", href);
      }

      // Bitcoin link (optional; hidden if empty)
      if (cryptoEl) {
        const cLinks = CFG.cryptoLinks?.[planId] || {};
        const cHref  = cLinks[region] || cLinks.ROW || "";
        if (cHref) {
          cryptoEl.style.display = "inline-block";
          cryptoEl.setAttribute("href", cHref);
          cryptoEl.textContent = lang === "es" ? "Pagar con Bitcoin" : "Pay with Bitcoin";
        } else {
          cryptoEl.style.display = "none";
        }
      }
    });
  }

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
