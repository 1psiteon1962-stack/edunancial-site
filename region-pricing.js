/* region-pricing.js — renders plans into #plans-root, silent regional adjust */
(function () {
  const $ = (sel) => document.querySelector(sel);
  function lang(){ return document.documentElement.getAttribute("lang") === "en" ? "en" : "es"; }
  function fmtUSD(n){ return n === 0 ? (lang()==="en"?"$0.00":"$0.00") : n.toLocaleString("en-US",{style:"currency",currency:"USD"}); }

  function getRegion(){
    // Lightweight guess; refine later if needed
    const nav = (navigator.language || "").toLowerCase();
    const cc = nav.includes("-") ? nav.split("-")[1].toUpperCase() : "US";
    // Optional: detect state from ?state=XX
    const u = new URL(location.href);
    const st = (u.searchParams.get("state") || "").toUpperCase();
    return { country: cc, state: st };
  }

  function render(){
    const root = $("#plans-root");
    if (!root || !window.EDN_PLANS) return;

    const { country, state } = getRegion();
    const adj = (window.EDN_PRICE_OVERRIDES && window.EDN_PRICE_OVERRIDES(country, state)) || {};
    const l = lang();

    root.innerHTML = `
      <style>
        .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}
        .plan{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:1rem}
        .price{font-size:1.8rem;font-weight:800;color:#0b3d91;margin:.1rem 0}
        .btn{display:inline-block;padding:.6rem 1rem;border-radius:12px;border:2px solid #d62828;background:#d62828;color:#fff;text-decoration:none;font-weight:700}
        .feat{color:#475569;margin:.3rem 0}
      </style>
      <div class="plans">
        ${window.EDN_PLANS.map(p=>{
          const price = (adj[p.id] ?? p.price);
          return `
            <div class="plan">
              <h3>${p.name[l]}</h3>
              <div class="price">${fmtUSD(price)} <span style="font-size:.9rem;color:#475569">${p.term[l]}</span></div>
              <ul class="feat">
                ${p.features[l].map(f=>`<li>${f}</li>`).join("")}
              </ul>
              <a class="btn" href="${p.href}">${p.cta[l]}</a>
            </div>`;
        }).join("")}
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("edn:langchange", render);
})();
