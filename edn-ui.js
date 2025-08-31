/* edn-ui.js */
(function () {
  const KEY = "edn_lang";
  const FALLBACK = "es";
  const norm = (l) => {
    l = String(l || "").toLowerCase();
    if (l.startsWith("en")) return "en";
    if (l.startsWith("es")) return "es";
    return FALLBACK;
  };
  const get  = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const save = (l) => { try { localStorage.setItem(KEY, norm(l)); } catch {} };
  const apply= (l) => {
    const lang = norm(l);
    document.documentElement.setAttribute("lang", lang);
    try { document.dispatchEvent(new CustomEvent("edn:langchange", { detail:{ lang } })); } catch {}
  };
  const API = {
    setLang(l){ save(l); apply(l); },
    getLang(){ return norm(get() || document.documentElement.getAttribute("lang") || FALLBACK); },
    toggle(){ API.setLang(API.getLang()==="en"?"es":"en"); },
    init(){
      let lang = get();
      if(!lang){
        const hint = (navigator.language||"").toLowerCase();
        lang = hint.startsWith("es") ? "es" : FALLBACK; // default Spanish
        save(lang);
      }
      apply(lang);
    }
  };
  window.EDN_UI = API;
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", API.init);
  else API.init();
})();
