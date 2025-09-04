/*!
 * Edunancial — EN/ES toggle + "Our Story" anchor & smooth scroll (single-file)  v5
 * Drop-in only. No HTML edits required.
 */
(function(){
  "use strict";
  if (window.__EDN_READY__) return; window.__EDN_READY__ = true;

  /* ----------------- Dictionary ----------------- */
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
      "course.red.t":"Oct 18 — Real Estate (Red)","course.white.t":"Oct 25 — Paper Assets (White)","course.blue.t":"Nov 8 — Business (Blue)",
      "course.cta":"Reserve seat",
      "audio.title":"Listen: Red, White & Blue messages",
      "audio.red":"There are many ways to buy real estate. The question is, what’s your plan? · Hay muchas maneras de comprar bienes raíces. La pregunta es, ¿cuál es su plan?",
      "audio.white":"Pay yourself first. Every pay you get take a percentage you can afford. Work towards 40%. · Páguese a usted mismo primero. Cada pago, separe un porcentaje que pueda permitirse. Trabaje hacia el 40%.",
      "audio.blue":"…in business you can make money and still be in bankruptcy court. That’s why business is about making Profit. · …en los negocios usted puede ganar dinero y aún estar en el tribunal de bancarrota. Por eso el negocio se trata de obtener Ganancia.",
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
      "course.red.t":"18 de oct — Bienes Raíces (Rojo)","course.white.t":"25 de oct — Activos de Papel (Blanco)","course.blue.t":"8 de nov — Negocios (Azul)",
      "course.cta":"Reservar",
      "audio.title":"Escuche: Mensajes Rojo, Blanco y Azul",
      "audio.red":"Hay muchas maneras de comprar bienes raíces. La pregunta es, ¿cuál es su plan? · There are many ways to buy real estate. The question is, what’s your plan?",
      "audio.white":"Páguese a usted mismo primero. Cada pago, separe un porcentaje que pueda permitirse. Trabaje hacia el 40%. · Pay yourself first. Every pay you get take a percentage you can afford. Work towards 40%.",
      "audio.blue":"…en los negocios usted puede ganar dinero y aún estar en el tribunal de bancarrota. Por eso el negocio se trata de obtener Ganancia. · …in business you can make money and still be in bankruptcy court. That’s why business is about making Profit.",
      "disclaimer":"Edunancial no brinda asesoría legal ni de inversión. Solo educación."
    }
  };

  /* ----------------- Helpers ----------------- */
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const getLang=()=>{try{return localStorage.getItem("edn_lang")||"en";}catch{return"en";}};
  const setLang=l=>{try{localStorage.setItem("edn_lang",l);}catch{};document.documentElement.setAttribute("lang",l);};
  const dict=()=>T[getLang()]||T.en;

  /* ----------------- Toggle rendering (nav + fixed backup) ----------------- */
  function ensureNavToggle(){
    const host = qs("nav.site .wrap")||qs("nav .wrap")||qs("nav");
    if(!host) return;
    let bar = qs("#edn-lang");
    if(!bar){ bar=document.createElement("div"); bar.id="edn-lang"; host.appendChild(bar); }
    bar.innerHTML = `<button type="button" data-lang="en">EN</button><button type="button" data-lang="es">ES</button>`;
    bar.style.display="flex"; bar.style.gap="8px"; bar.style.marginLeft="12px";
    qsa("#edn-lang button").forEach(b=>{
      b.style.cssText="font-weight:700;border:1px solid rgba(0,0,0,.25);padding:6px 10px;border-radius:12px;background:#fff;color:#0b2c54;cursor:pointer";
    });
  }
  function ensureFabToggle(){
    let fab = qs("[data-edn-fab='lang']");
    if(!fab){
      fab=document.createElement("div");
      fab.setAttribute("data-edn-fab","lang");
      fab.innerHTML = `<button type="button" data-lang="en">EN</button><button type="button" data-lang="es">ES</button>`;
      document.body.appendChild(fab);
    }
    const css=`
      [data-edn-fab='lang']{position:fixed;top:10px;right:10px;z-index:2147483647;display:flex;gap:.5rem}
      [data-edn-fab='lang'] button{font-size:14px!important;font-weight:700!important;padding:.38rem .6rem;border-radius:.6rem;
        border:1px solid rgba(0,0,0,.25);background:#fff;color:#0b2239!important;cursor:pointer}
      [data-edn-fab='lang'] button.active{background:#0b2239;color:#fff!important;border-color:#0b2239}
      @media (prefers-color-scheme:dark){
        [data-edn-fab='lang'] button{border-color:rgba(255,255,255,.35);background:#0b2239;color:#fff!important}
        [data-edn-fab='lang'] button.active{background:#fff;color:#0b2239!important;border-color:#fff}
      }
    `;
    const s=document.createElement("style"); s.textContent=css; document.head.appendChild(s);
  }

  /* ----------------- i18n apply ----------------- */
  function applyI18n(){
    const d=dict();
    qsa("[data-i18n]").forEach(el=>{
      const k=el.getAttribute("data-i18n"); const val=d[k];
      if(!val) return;
      if(el.childNodes.length>1){
        for(const n of el.childNodes){ if(n.nodeType===3) n.nodeValue=val; }
      } else {
        el.textContent=val;
      }
    });
    qsa("#edn-lang button,[data-edn-fab='lang'] button").forEach(b=>{
      b.classList.toggle("active", b.dataset.lang===getLang());
    });
  }

  /* ----------------- Story: ensure anchor + section near top ----------------- */
  function ensureStoryBlock(){
    const main = qs("main")||document.body;
    // Try to find an existing story section (by key or by heading text)
    let story = qs("#our-story") ||
                qs("[data-i18n='story.title']")?.closest("section") ||
                qsa("h1,h2,h3").find(h=>/Why Edunancial\?|¿Por qué Edunancial\?/i.test(h.textContent||""))?.closest("section");
    if (!story){
      // Create a new one right after the hero/first section
      story = document.createElement("section");
      story.className = "card";
      story.setAttribute("data-edn-injected","story");
      story.innerHTML = `
        <span class="badge" data-i18n="story.badge">Our Story</span>
        <h2 class="section-title" data-i18n="story.title">Why Edunancial?</h2>
        <p data-i18n="story.p1">We started Edunancial to make financial education simple, practical, and respectful. No hype. No guilt.</p>
        <p data-i18n="story.p2">Red, White and Blue is our framework: buy or control assets (Red), build liquid wealth (White), and run a profitable business (Blue).</p>
        <p data-i18n="story.p3">You deserve tools that work in English or Spanish, affordable plans, and options to act today.</p>
      `;
      // minimal styling if CSS not present
      story.style.cssText="background:#fff;border-radius:18px;box-shadow:0 6px 22px rgba(11,34,57,.12);padding:18px;margin:18px 0";
      const hero = qs(".hero, header.hero, main section");
      if (hero && hero.parentNode===main) main.insertBefore(story, hero.nextSibling); else main.prepend(story);
    }
    // Ensure it has the anchor id
    if (!story.id) story.id = "our-story";

    // Make sure sticky headers don’t cover it
    const header = qs("nav.site") || qs("header");
    const pad = header ? Math.max(56, Math.round(header.getBoundingClientRect().height)+8) : 64;
    story.style.scrollMarginTop = pad + "px";
  }

  /* ----------------- Wire all "Our Story" buttons/links ----------------- */
  function wireStoryButtons(){
    const targetId = "our-story";
    // Any element that looks like an Our Story action
    const candidates = [
      ...qsa("[href*='our-story']"),
      ...qsa("[data-i18n='story.badge']"),
      ...qsa("a,button").filter(el=>{
        const t=(el.textContent||"").toLowerCase();
        return /our story|nuestra historia/.test(t);
      })
    ];
    candidates.forEach(el=>{
      if (el.tagName.toLowerCase()==="a"){
        el.setAttribute("href", "#"+targetId);
      } else {
        el.setAttribute("role","button");
        el.setAttribute("data-story-link","true");
      }
    });

    const go=(e)=>{
      const link = e.target.closest("a[href^='#our-story'],[data-story-link]");
      if(!link) return;
      e.preventDefault();
      const sec = qs("#"+targetId);
      if(!sec) return;
      sec.scrollIntoView({behavior:"smooth", block:"start"});
    };
    document.addEventListener("click", go, {capture:true});
    document.addEventListener("touchstart", go, {capture:true, passive:false});
  }

  /* ----------------- Language toggle events (capture) ----------------- */
  function bindLangEvents(){
    const onPress=(e)=>{
      const btn = e.target.closest("#edn-lang button,[data-edn-fab='lang'] button");
      if(!btn) return;
      e.preventDefault();
      setLang(btn.dataset.lang);
      applyI18n();
    };
    document.addEventListener("click", onPress, {capture:true});
    document.addEventListener("touchstart", onPress, {capture:true, passive:false});
  }

  /* ----------------- Observe DOM changes ----------------- */
  function observe(){
    const mo=new MutationObserver(muts=>{
      let changed=false;
      for(const m of muts){ if(m.addedNodes && m.addedNodes.length){ changed=true; break; } }
      if(changed){ applyI18n(); ensureStoryBlock(); }
    });
    mo.observe(document.body,{childList:true,subtree:true});
  }

  /* ----------------- Boot ----------------- */
  function ready(){
    // language
    setLang(getLang());
    // toggles
    ensureNavToggle();
    ensureFabToggle();
    bindLangEvents();
    // story anchor + button wiring
    ensureStoryBlock();
    wireStoryButtons();
    // translate data-i18n elements
    applyI18n();
    // keep in sync
    observe();
  }
  (document.readyState==="loading") ? document.addEventListener("DOMContentLoaded", ready) : ready();
})();
