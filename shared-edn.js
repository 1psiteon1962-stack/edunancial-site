/* Edunancial language toggle (works on every page) */
(function(){
  const KEY = "edn_lang";
  const normalize = l => (l||"en").toLowerCase().startsWith("es") ? "es" : "en";

  function apply(lang){
    const L = normalize(lang);
    document.documentElement.setAttribute("lang", L);
    document.querySelectorAll(".lang button").forEach(b=>{
      b.classList.toggle("active", (b.dataset.setlang||"") === L);
    });
    // Optional: swap audio sources if present
    document.querySelectorAll('audio[data-audio-en]').forEach(a=>{
      const s = L==="es" ? a.dataset.audioEs : a.dataset.audioEn;
      if (s && a.src !== location.origin + s){ a.src = s; a.load(); }
    });
  }

  window.setLang = (l)=>{ localStorage.setItem(KEY,l); apply(l); };

  document.addEventListener("DOMContentLoaded", ()=>{
    const url = new URLSearchParams(location.search);
    apply(url.get("lang") || localStorage.getItem(KEY) || "en");
  });
})();
