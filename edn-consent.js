/* edn-consent.js — simple, self-contained consent banner + GA loader */
(function () {
  const LS = "edn_consent";
  const GA_ID = window.EDN_GA_ID || "G-XXXXXXXXXX"; // <-- set your GA4 ID later
  const has = () => { try { return localStorage.getItem(LS); } catch { return null; } };
  const set = (v) => { try { localStorage.setItem(LS, v); } catch {} };

  function loadGA(){
    if (!GA_ID || GA_ID === "G-XXXXXXXXXX") return; // do nothing until you set it
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
    const s1 = document.createElement('script'); s1.async = true;
    s1.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s1);
  }

  function banner(){
    const prior = has();
    if (prior === "accept") { loadGA(); return; }
    if (prior === "deny") { return; }

    const bar = document.createElement('div');
    bar.style.cssText = "position:fixed;inset:auto 0 0 0;background:#0f172a;color:#fff;padding:.9rem;z-index:9999;display:flex;gap:.6rem;flex-wrap:wrap;align-items:center;justify-content:center";
    bar.innerHTML = `
      <span style="opacity:.9">We use cookies for analytics to improve Edunancial. Do you consent?</span>
      <button id="edn-accept" style="padding:.45rem .8rem;border-radius:10px;border:2px solid #0b3d91;background:#0b3d91;color:#fff;font-weight:700">Accept</button>
      <button id="edn-deny" style="padding:.45rem .8rem;border-radius:10px;border:2px solid #e5e7eb;background:#fff;color:#0f172a;font-weight:700">No thanks</button>
    `;
    document.body.appendChild(bar);
    bar.querySelector('#edn-accept').onclick = () => { set("accept"); bar.remove(); loadGA(); };
    bar.querySelector('#edn-deny').onclick   = () => { set("deny");   bar.remove(); };
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", banner);
  else banner();
})();
