/* region-pricing.js — renders plans into #plans-root on any page that has it */
(function () {
  function $(sel, root = document) { return root.querySelector(sel); }
  function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function fmt(n, currency) {
    try {
      return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(n);
    } catch {
      return "$" + n.toFixed(2);
    }
  }

  function renderPlans() {
    const mount = document.getElementById("plans-root");
    if (!mount) return; // page has no plans area — nothing to do

    const cfg = window.EDN_PRICING || {};
    const mult = (cfg.regionMultiplier && cfg.regionMultiplier()) || 1.0;

    const prices = {
      basic: {
        m: Math.round(cfg.basic.monthly * mult * 100) / 100,
        y: Math.round(cfg.basic.annual * mult * 100) / 100
      },
      gold: {
        m: Math.round(cfg.gold.monthly * mult * 100) / 100,
        y: Math.round(cfg.gold.annual * mult * 100) / 100
      }
    };

    // i18n labels (read from current page language)
    const lang = document.documentElement.lang === "es" ? "es" : "en";
    const t = (k, fallback) => {
      const pack = (window.__EDN_I18N_CACHE ||= {});
      if (!pack.en) pack.en = {};
      // Pull from the same map used by edn-ui.js by reading data-i18n of a temp element
      const map = {
        en: {
          monthly: "Monthly", annually: "Annually",
          plan_basic: "Basic", plan_gold: "Gold",
          plan_basic_desc: "Access to lessons, templates, and community. No discounts.",
          plan_gold_desc: "Everything in Basic + member discounts, early-bird offers, and specials.",
          choose_plan: "Choose plan", per_month: "/month", per_year: "/year", upgrade_anytime: "You can upgrade anytime."
        },
        es: {
          monthly: "Mensual", annually: "Anual",
          plan_basic: "Básico", plan_gold: "Oro",
          plan_basic_desc: "Acceso a lecciones, plantillas y comunidad. Sin descuentos.",
          plan_gold_desc: "Todo en Básico + descuentos para miembros, preventas y ofertas.",
          choose_plan: "Elegir plan", per_month: "/mes", per_year: "/año", upgrade_anytime: "Puedes mejorar en cualquier momento."
        }
      };
      return (map[lang] && map[lang][k]) || (map.en && map.en[k]) || fallback || k;
    };

    // simple monthly/annual toggle (local to the plans area)
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div style="display:flex;justify-content:flex-end;gap:8px;margin:8px 0 16px">
        <button type="button" data-term="m" class="term-btn" style="padding:.45rem .8rem;border-radius:10px;border:1px solid #e5e7eb;font-weight:700">${t("monthly")}</button>
        <button type="button" data-term="y" class="term-btn" style="padding:.45rem .8rem;border-radius:10px;border:1px solid #e5e7eb;font-weight:700;opacity:.7">${t("annually")}</button>
      </div>
      <div class="plans-grid" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px"></div>
      <p style="margin-top:10px;color:#64748b;font-size:.95rem">${t("upgrade_anytime")}</p>
    `;
    mount.innerHTML = "";
    mount.appendChild(wrapper);

    const grid = $(".plans-grid", wrapper);

    function card(nameKey, descKey, priceM, priceY, features) {
      const card = document.createElement("article");
      card.className = "plan-card";
      card.style.cssText = "border:1px solid #e5e7eb;border-radius:16px;padding:16px;background:#fff";
      card.innerHTML = `
        <h3 style="margin:.25rem 0 0">${t(nameKey)}</h3>
        <p style="color:#64748b;margin:.25rem 0 1rem">${t(descKey)}</p>
        <div class="price" data-m="${priceM}" data-y="${priceY}" style="font-size:1.6rem;font-weight:800;margin:.25rem 0 8px">
          <span class="price-number">${fmt(priceM, cfg.currency)}</span>
          <span class="price-term" style="font-size:.9rem;color:#64748b">${t("per_month")}</span>
        </div>
        <ul style="margin:0 0 12px 20px;padding:0;color:#0f172a">${(features||[]).map(li=>`<li>${li}</li>`).join("")}</ul>
        <button type="button" class="choose-btn" style="background:#d62828;color:#fff;border:0;padding:.6rem 1rem;border-radius:12px;font-weight:800">${t("choose_plan")}</button>
      `;
      return card;
    }

    const basicCard = card(
      "plan_basic",
      "plan_basic_desc",
      prices.basic.m,
      prices.basic.y,
      (cfg.features && cfg.features.basic) || []
    );
    const goldCard = card(
      "plan_gold",
      "plan_gold_desc",
      prices.gold.m,
      prices.gold.y,
      (cfg.features && cfg.features.gold) || []
    );
    grid.appendChild(basicCard);
    grid.appendChild(goldCard);

    function updateTerm(term) {
      $all(".term-btn", wrapper).forEach(b=>{
        const active = b.getAttribute("data-term")===term;
        b.style.opacity = active ? "1" : ".7";
        b.style.background = active ? "#0b3d91" : "#fff";
        b.style.color = active ? "#fff" : "#0b3d91";
        b.style.borderColor = "#0b3d91";
      });
      $all(".price", wrapper).forEach(p=>{
        const m = parseFloat(p.getAttribute("data-m"));
        const y = parseFloat(p.getAttribute("data-y"));
        $(".price-number", p).textContent = fmt(term==="m"?m:y, cfg.currency);
        $(".price-term", p).textContent = term==="m" ? t("per_month") : t("per_year");
      });
    }

    $all(".term-btn", wrapper).forEach(b=>{
      b.addEventListener("click", ()=>updateTerm(b.getAttribute("data-term")));
    });
    updateTerm("m"); // default

    // Hook “Choose plan” buttons (replace with Square/checkout later)
    $all(".choose-btn", wrapper).forEach((btn, idx)=>{
      btn.addEventListener("click", ()=>{
        const plan = idx===0 ? "basic" : "gold";
        alert("Selected: " + plan.toUpperCase() + " — connect to Square checkout here.");
      });
    });

    // Rerender prices when language changes (only labels change)
    document.addEventListener("edn:lang", ()=>updateTerm("m"));
  }

  document.addEventListener("DOMContentLoaded", renderPlans);
})();
