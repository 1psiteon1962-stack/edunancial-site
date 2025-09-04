/*!
 * Edunancial — site-wide EN/ES toggle + Story auto-restore (non-destructive)  v2
 * File: /shared-edn.js
 * Goal: Bring back the language toggle and the inspirational "Our Story"
 *       WITHOUT deleting/overwriting existing content.
 */
(function(){
  "use strict";
  if (window.__EDN_READY__) return; window.__EDN_READY__ = true;

  /* ========= i18n dictionary ========= */
  const T = {
    en:{
      "nav.home":"Home","nav.books":"Books","nav.courses":"Mini-Courses","nav.contact":"Contact",
      "hero.title":"Learn money the practical way — red, white & blue.",
      "hero.sub":"Bilingual financial education focused on Real Estate, Paper Assets, and Business. Simple steps, real results.",
      "story.badge":"Our Story","story.title":"Why Edunancial?",
      "story.p1":"We started Edunancial to make financial education simple, practical, and respectful. No hype. No guilt.",
      "story.p2":"Red, White and Blue is our framework: buy or control assets (Red), build liquid wealth (White), and run a profitable business (Blue).",
      "story.p3":"You deserve tools that work in English or Spanish, affordable plans, and options to act today.",
      "books.title":"Books (English & Español)","books.sub":"Full-color covers by track: Red = Real Estate, White = Paper Assets, Blue = Business.",
      "btn.buy":"Buy","btn.more":"Learn more",
      "courses.title":"Mini-Courses","courses.sub":"Live sessions — one theme each week. Join from your phone.",
      "course.cta":"Reserve seat",
      "disclaimer":"Edunancial does not provide legal or investment advice. Education only."
    },
    es:{
      "nav.home":"Inicio","nav.books":"Libros","nav.courses":"Mini-cursos","nav.contact":"Contacto",
      "hero.title":"Aprenda sobre dinero de forma práctica — rojo, blanco y azul.",
      "hero.sub":"Educación financiera bilingüe enfocada en Bienes Raíces, Activos de Papel y Negocios. Pasos simples, resultados reales.",
      "story.badge":"Nuestra Historia","story.title":"¿Por qué Edunancial?",
      "story.p1":"Creamos Edunancial para que la educación financiera sea simple, práctica y respetuosa. Sin exageraciones. Sin culpa.",
      "story.p2":"Rojo, Blanco y Azul es nuestro marco: comprar o controlar activos (Rojo), crear riqueza líquida (Blanco) y operar un negocio rentable (Azul).",
      "story.p3":"Usted merece herramientas que funcionen en inglés o español, planes accesibles y opciones para actuar hoy.",
      "books.title":"Libros (English & Español)","books.sub":"Portadas por ruta: Rojo = Bienes Raíces, Blanco = Activos de Papel, Azul = Negocios.",
      "btn.buy":"Comprar","btn.more":"Saber más",
      "courses.title":"Mini-cursos","courses.sub":"Sesiones en vivo — un tema por semana. Únase desde su teléfono.",
      "course.cta":"Reservar",
      "disclaimer":"Edunancial no brinda asesoría legal ni de inversión. Solo educación."
    }
  };

  /* ========= helpers ========= */
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const getLang=()=>{try{return localStorage.getItem("edn_lang")||"en";}catch{return"en";}};
  const setLang=l=>{try{localStorage.setItem("edn_lang",l);}catch{};document.documentElement.setAttribute("lang",l);};
  const dict=()=>T[getLang()]||T.en;
  const norm=s=>(s||"").replace(/\s+/g," ").trim();

  /* ========= mount language toggle (non-destructive) ========= */
  function ensureToggle(){
    // Try to place inside nav; fall back to a fixed widget if no nav
    const nav = qs("nav.site .wrap") || qs("nav .wrap") || qs("nav") || null;
    let bar = qs("#edn-lang");
    if (!bar){
      bar = document.createElement("div");
      bar.id = "edn-lang";
      if (nav) nav.appendChild(bar); else document.body.appendChild(bar);
    }
    // Render buttons (idempotent)
    bar.innerHTML = `
      <button data-lang="en" type="button">EN</button>
      <button data-lang="es" type="button">ES</button>
    `;
    // Minimal styles (inline so no CSS file required)
    Object.assign(bar.style, {display:"flex",gap:"8px",marginLeft: nav ? "12px" : "0", position: nav ? "static":"fixed", top: nav ? "":"10px", right: nav ? "":"10px", zIndex: "2147483647"});
    qsa("#edn-lang button").forEach(b=>{
      b.style.cssText = "font-weight:700;border:1px solid rgba(0,0,0,.25);padding:6px 10px;border-radius:12px;background:#fff;color:#0b2c54;cursor:pointer";
      b.classList.toggle("active", b.dataset.lang===getLang());
    });

    // Click handler (capture to survive other scripts)
    bar.addEventListener("click",e=>{
      const btn = e.target.closest("button[data-lang]"); if(!btn) return;
      setLang(btn.dataset.lang); applyI18n();
      qsa("#edn-lang button").forEach(b=>b.classList.toggle("active", b===btn));
    }, {capture:true});
  }

  /* ========= Our Story auto-restore (only if missing) ========= */
  function ensureStory(){
    // Detect if a section with the story key already exists
    const existing = qsa("[data-i18n='story.title'], [data-i18n='story.badge']").length > 0;
    if (existing) return; // do not duplicate; we preserve what you have

    const main = qs("main") || document.body;
    // Insert near the top (but after any hero/header if present)
    const section = document.createElement("section");
    section.className = "card";
    section.setAttribute("data-edn-injected","story");

    section.innerHTML = `
      <span class="badge" data-i18n="story.badge">Our Story</span>
      <h2 class="section-title" data-i18n="story.title">Why Edunancial?</h2>
      <p data-i18n="story.p1">We started Edunancial to make financial education simple, practical, and respectful. No hype. No guilt.</p>
      <p data-i18n="story.p2">Red, White and Blue is our framework: buy or control assets (Red), build liquid wealth (White), and run a profitable business (Blue).</p>
      <p data-i18n="story.p3">You deserve tools that work in English or Spanish, affordable plans, and options to act today.</p>
    `;

    // Basic inline style so it looks like your cards without needing CSS edits
    section.style.cssText = "background:#fff;border-radius:18px;box-shadow:0 6px 22px rgba(11,34,57,.12);padding:18px;margin:18px 0";
    const h2s = section.querySelectorAll(".section-title"); h2s.forEach(h=>h.style.margin="8px 0 14px");

    // Find insertion point: after the first existing section/hero if any
    const firstSection = qs("main section, .hero, header.hero");
    if (firstSection && firstSection.parentNode===main) {
      main.insertBefore(section, firstSection.nextSibling);
    } else {
      main.prepend(section);
    }
  }

  /* ========= i18n apply ========= */
  function applyI18n(){
    const d = dict();
    // Translate any element with data-i18n
    qsa("[data-i18n]").forEach(el=>{
      const k = el.getAttribute("data-i18n");
      const val = d[k];
      if (!val) return;
      if (el.firstChild && el.childNodes.length>1){
        // Replace only text nodes
        for (const n of el.childNodes){ if (n.nodeType===3) n.nodeValue = val; }
      } else {
        el.textContent = val;
      }
    });
    // Update toggle state
    qsa("#edn-lang button").forEach(b=>b.classList.toggle("active", b.dataset.lang===getLang()));
    // Title fallback
    if (document.title.trim()==="" || /Edunancial/i.test(document.title)) {
      document.title = d["hero.title"] || document.title;
    }
  }

  /* ========= observe DOM changes (keep things translated) ========= */
  function observe(){
    const mo = new MutationObserver(muts=>{
      let needs=false;
      for (const m of muts){ if (m.addedNodes && m.addedNodes.length){ needs=true; break; } }
      if (needs){ applyI18n(); }
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }

  /* ========= boot ========= */
  function ready(){
    // Make sure language is set
    setLang(getLang());
    ensureToggle();     // restore toggle (non-destructive)
    ensureStory();      // add Story only if it's missing
    applyI18n();        // translate keys
    observe();          // keep new nodes translated
  }

  (document.readyState==="loading") ? document.addEventListener("DOMContentLoaded", ready) : ready();
})();
