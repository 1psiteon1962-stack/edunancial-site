/* Edunancial — language toggle + audio source swap */
(function () { 
  const KEY = "edn_lang";
  const pick = (l)=> (l||"en").toLowerCase().startsWith("es") ? "es" : "en";

  function applyLang(l){
    const lang = pick(l);
    document.documentElement.setAttribute("lang", lang);
    document.querySelectorAll(".lang-switch button")
      .forEach(b => b.classList.toggle("active", (b.dataset.setlang||"")===lang));
    // Swap any audio sources by language (if provided)
    document.querySelectorAll('audio[data-audio-en]').forEach(a=>{
      const src = lang==="es" ? a.dataset.audioEs : a.dataset.audioEn;
      if (src && a.getAttribute("src")!==src){ a.setAttribute("src",src); a.load(); }
    });
  }

  window.setLang = function(l){ localStorage.setItem(KEY,l); applyLang(l); };

  document.addEventListener("DOMContentLoaded",()=>{
    const url = new URLSearchParams(location.search);
    applyLang(url.get("lang") || localStorage.getItem(KEY) || "en");
  });
})();
