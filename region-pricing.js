/* region-pricing.js — Renders plans into #plans-root with a Monthly/Annual toggle,
   bilingual labels, and silent regional price overrides.
*/
(function () {
  const $ = (s) => document.querySelector(s);
  const L = () => (document.documentElement.getAttribute("lang") === "en" ? "en" : "es");
  const money = (n) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const BILLING_KEY = "edn_billing"; // "monthly" | "annual"
  const getBilling = () => {
    try { return (localStorage.getItem(BILLING_KEY) || "monthly"); } catch { return "monthly"; }
  };
  const setBilling = (v) => {
    try { localStorage.setItem(BILLING_KEY, v); } catch {}
    render(); // re-render on change
  };

  function getRegion() {
    const nav = (navigator.language || "").toLowerCase();
    const country = nav.includes("-") ? nav.split("-")[1].toUpperCase() : "US";
    const st = (new URL(location.href)).searchParams.get("state") || "";
    return { country, state: st.toUpperCase() };
  }

  function displayPrice(plan, billing, overridesForPlan) {
    const eff = { monthly: plan.monthly, annual: plan.annual, ...(overridesForPlan || {}) };
    if (billing === "annual") {
      const total = eff.annual ?? eff.monthly * 12;
      const perMo = total > 0 ? total / 12 : 0;
      return { headline: money(perMo) + (L()==="en" ? " /month" : " /mes"), sub: (total>0 ? (L()==="en" ? `Billed yearly: ${money(total)}` : `Cobro anual: ${money(total)}`) : "") };
    } else {
      const m = eff.monthly ?? 0;
      return { headline: money(m) + (L()==="en" ? " /month" : " /mes"), sub: "" };
    }
  }

  function render() {
    const root = $("#plans-root");
    if (!root || !Array.isArray(window.EDN_PLANS)) return;

    const billing = getBilling(); // 'monthly' | 'annual'
    const { country, state } = getRegion();
    const overrides = (window.EDN_PRICE_OVERRIDES && window.EDN_PRICE_OVERRIDES(country, state)) || {};
    const lang = L();

    const labels = {
      monthly: { en: "Monthly", es: "Mensual" },
      annual:  { en: "Annual (best value)", es: "Anual (mejor valor)" },
      seeFinal:{ en: "You’ll see the final amount before checkout.", es: "Verás el importe final antes del pago." }
    };

    root.innerHTML = `
      <style>
        .billing{display:flex;gap:.5rem;margin:0 0 1rem 0;align-items:center}
        .seg{display:inline-flex;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
        .seg button{padding:.5rem .9rem;border:0;background:#fff;cursor:pointer}
        .seg button.active{background:#0b3d91;color:#fff;font-weight:800}
        .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem}
        .plan{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1.25rem}
        .plan h3{margin:.2rem 0}
        .price{font-size:1.9rem;font-weight:800;color:#0b3d91;margin:.2rem 0}
        .sub{color:#475569;font-size:.95rem;margin-bottom:.4rem}
        .feat{margin:.35rem 0;color:#475569}
        .btn{display:inline-block;margin-top:.6rem;padding:.6rem 1rem;border-radius:12px;border:2px solid #d62828;background:#d62828;color:#fff;text-decoration:none;font-weight:700}
        .muted{color:#64748b;margin:1rem 0 0 0}
      </style>

      <div class="billing">
        <div class="seg" role="tablist" aria-label="Billing period">
          <button id="b-monthly" class="${billing==='monthly'?'active':''}" role="tab">${labels.monthly[lang]}</button>
          <button id="b-annual"  class="${billing==='annual'?'active':''}"  role="tab">${labels.annual[lang]}</button>
        </div>
      </div>

      <div class="plans">
        ${window.EDN_PLANS.map(p=>{
          const disp = displayPrice(p, billing, overrides[p.id]);
          return `
            <div class="plan">
              <h3>${p.name[lang]}</h3>
              <div class="price">${disp.headline}</div>
              ${disp.sub ? `<div class="sub">${disp.sub}</div>` : ``}
              <ul class="feat">${p.features[lang].map(f=>`<li>${f}</li>`).join("")}</ul>
              <a class="btn" href="${p.href}">${p.cta[lang]}</a>
            </div>
          `;
        }).join("")}
      </div>

      <p class="muted">${labels.seeFinal[lang]}</p>
    `;

    // wire up toggle
    $("#b-monthly")?.addEventListener("click", ()=>setBilling("monthly"));
    $("#b-annual")?.addEventListener("click", ()=>setBilling("annual"));
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("edn:langchange", render);
})();
