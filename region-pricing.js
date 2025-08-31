<script>
function ednRenderPlans(){
  const root = document.getElementById("plans-root");
  if (!root) return;
  const lang = document.documentElement.getAttribute("lang") || "en";
  const T = EDN_I18N[lang];
  const P = window.EDN_PRICING;

  // UI toggle
  const wrap = document.createElement("section");
  wrap.className = "edn-plans";
  const active = (localStorage.getItem("edn_billing")||"monthly");
  function btn(isAnnual){ return `
    <button data-mode="monthly" class="edn-toggle ${!isAnnual?'on':''}">${T.plan_monthly}</button>
    <button data-mode="annual"  class="edn-toggle ${isAnnual?'on':''}">${T.plan_annual}</button>
  `;}
  wrap.innerHTML = `
    <div class="container">
      <h2 class="center" data-i18n="plans_title">${T.plans_title}</h2>
      <p class="muted center" data-i18n="plans_sub">${T.plans_sub}</p>
      <div class="toggle-row">${btn(active==="annual")}</div>
      <div class="cards" id="edn-plan-cards"></div>
    </div>
  `;
  root.innerHTML = ""; root.appendChild(wrap);

  function renderCards(mode){
    const cfg = P[mode];
    const node = wrap.querySelector("#edn-plan-cards");
    node.innerHTML = ["basic","gold"].map(kind=>{
      const planName = kind==="basic"?T.plan_basic:T.plan_gold;
      const data = cfg[kind];
      const feats = data.features.map(k=>`<li>${T[k]}</li>`).join("");
      const note = data.note?`<div class="note">${data.note}</div>`:"";
      return `
        <article class="card plan">
          <h3>${planName}</h3>
          <div class="price">$${data.price} <span class="per">/${mode==='annual'?'year':'month'}</span></div>
          ${note}
          <h4 class="includes">${T.plan_includes}</h4>
          <ul class="features">${feats}</ul>
          <button class="btn select" data-kind="${kind}" data-mode="${mode}">${T.plan_btn_select}</button>
          ${kind==='basic'?`<div class="upgrade"><a href="pricing.html#gold" class="link">${T.plan_upgrade}</a></div>`:""}
        </article>
      `;
    }).join("");
    // bind selects
    node.querySelectorAll(".btn.select").forEach(b=>{
      b.onclick = ()=>{
        const kind = b.getAttribute("data-kind");
        const mode = b.getAttribute("data-mode");
        // placeholder checkout action
        location.href = `thank-you.html?plan=${kind}&cycle=${mode}`;
      };
    });
  }

  renderCards(active);

  // Toggle handling
  wrap.querySelectorAll(".edn-toggle").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const mode = btn.getAttribute("data-mode");
      wrap.querySelectorAll(".edn-toggle").forEach(x=>x.classList.remove("on"));
      btn.classList.add("on");
      localStorage.setItem("edn_billing", mode);
      renderCards(mode);
    });
  });
}

document.addEventListener("DOMContentLoaded", ednRenderPlans);
window.addEventListener("edn:lang", ednRenderPlans);
</script>
