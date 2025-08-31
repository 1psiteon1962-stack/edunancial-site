<!-- edn-consent.js -->
<script>
/* Minimal consent:
   - Shows banner only for likely EU/EEA/UK + Quebec users (language or timezone).
   - Respects Do Not Track: if DNT=1, we do NOT load analytics and do NOT show banner.
   - Stores decision in localStorage "edn_consent": "granted" | "denied".
   - If window.EDN_FORCE_CONSENT === true, always show; === false, never show.
   - Load GA only when consent === "granted".
*/
(function(){
  const KEY="edn_consent";

  function dntOn(){
    return (navigator.doNotTrack=="1"||window.doNotTrack=="1"||navigator.msDoNotTrack=="1");
  }

  function get(){
    try{return localStorage.getItem(KEY)||""}catch{return""}
  }
  function set(v){
    try{localStorage.setItem(KEY,v)}catch{}
    document.dispatchEvent(new CustomEvent("edn:consent",{detail:v}));
  }

  function likelyEUorUKorQC(){
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone||"").toLowerCase();
    const lang = (navigator.language||"").toLowerCase();
    const langsEU = ["en-gb","en-ie","fr","fr-fr","fr-be","fr-lu","fr-ca","de","it","es","pt","nl","sv","fi","da","no","pl","cs","sk","hu","ro","bg","el","et","lv","lt","mt","sl","hr"];
    if(langsEU.some(l=>lang.startsWith(l))) return true;
    const tzEU = ["europe/","gb","greenwich","utc+1","utc+2"];
    if(tzEU.some(t=>tz.includes(t))) return true;
    // Quebec: French-Canada or America/Toronto (approx)
    if(lang.startsWith("fr-ca")) return true;
    if(tz.includes("toronto")||tz.includes("montreal")) return true;
    return false;
  }

  function shouldAsk(){
    if (dntOn()) return false;
    if (typeof window.EDN_FORCE_CONSENT === "boolean") return window.EDN_FORCE_CONSENT;
    if (get()) return false;
    return likelyEUorUKorQC();
  }

  function renderBanner(){
    const bar=document.createElement("div");
    bar.id="edn-cookie-bar";
    bar.style.cssText="position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#0b3d91;color:#fff;padding:14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap";
    bar.innerHTML = `
      <div style="flex:1;min-width:240px">We use cookies for analytics to improve Edunancial. Do you consent?</div>
      <button id="edn-accept" style="background:#fff;color:#0b3d91;border:0;padding:.5rem 1rem;border-radius:10px;font-weight:800">Accept</button>
      <button id="edn-deny" style="background:#d62828;color:#fff;border:0;padding:.5rem 1rem;border-radius:10px;font-weight:800">No thanks</button>
    `;
    document.body.appendChild(bar);
    document.getElementById("edn-accept").onclick=function(){ set("granted"); bar.remove(); maybeLoadGA(); }
    document.getElementById("edn-deny").onclick=function(){ set("denied"); bar.remove(); }
  }

  function maybeLoadGA(){
    if (!window.EDN_GA_ID) return;
    if (get()!=="granted") return;
    if (dntOn()) return;
    if (window.__edn_ga_loaded) return;
    window.__edn_ga_loaded=true;
    const s1=document.createElement("script");
    s1.async=true; s1.src=`https://www.googletagmanager.com/gtag/js?id=${window.EDN_GA_ID}`;
    const s2=document.createElement("script");
    s2.innerHTML=`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${window.EDN_GA_ID}');`;
    document.head.appendChild(s1); document.head.appendChild(s2);
  }

  // Init
  if (shouldAsk()) { window.addEventListener("load",renderBanner); }
  // Load GA immediately if already granted
  if (get()==="granted") { maybeLoadGA(); }
})();
</script>
