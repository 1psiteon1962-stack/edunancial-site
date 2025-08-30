<script>
(function(){
  const CFG = window.EDU_PRICING_CONFIG;

  // ===== Feature flags =====
  const USE_SQUARE_FUNCTION = false; // turn on after adding Netlify function

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
    return storage.getItem("edu_region") || getCookie
