/* region-pricing.js — optional, disabled by default (keeps UI clean; no "region" text anywhere) */
(function(){
  const ENABLE_REGION = false;            // set to true to enable silent display adjustments
  const MULTIPLIER_BY_COUNTRY = {         // e.g., 'MX':0.85,'IN':0.70,'US':1.0
  };
  function getCountryFromCookie(){
    try{
      const m = document.cookie.match(/(?:^|;\s*)EDU_COUNTRY=([A-Z]{2})/);
      return m ? m[1] : null;
    }catch(e){ return null; }
  }
  function formatUSD(x){ return '$' + Number(x).toFixed(0); }
  function run(){
    if(!ENABLE_REGION) return;
    const c = getCountryFromCookie();
    if(!c || !MULTIPLIER_BY_COUNTRY[c]) return;
    const k = MULTIPLIER_BY_COUNTRY[c];
    document.querySelectorAll('[data-price-usd]').forEach(el=>{
      const base = parseFloat(el.getAttribute('data-price-usd')||'0');
      el.textContent = formatUSD(base*k);
    });
  }
  document.addEventListener('DOMContentLoaded', run);
})();
