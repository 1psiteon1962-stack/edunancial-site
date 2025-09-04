/*!
 * Edunancial — Hardened EN/ES Toggle (always-visible, self-healing)  v6
 * Single drop-in. No HTML changes required.
 * - Renders a fixed top-right EN/ES toggle that cannot be hidden by site CSS.
 * - Works even if other scripts stop propagation (capture listeners).
 * - Persists choice via localStorage ("edn_lang").
 * - Translates any elements that already use [data-i18n] keys.
 * - Self-heals if removed/hidden by other scripts.
 */
(function(){
  "use strict";

  // Prevent old copies from short-circuiting this version
  if (window.__EDN_READY_V6__) return;
  window.__EDN_READY_V6__ = true;

  /* ================== i18n dictionary (keys must match your HTML data-i18n) ================== */
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

  /* ================== helpers ================== */
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const getLang=()=>{try{return localStorage.getItem("edn_lang")||"en";}catch{return"en";}};
  const setLang=l=>{try{localStorage.setItem("edn_lang",l);}catch{};document.documentElement.setAttribute("lang",l);};
  const dict=()=>T[getLang()]||T.en;

  /* ================== fixed toggle (cannot be hidden) ================== */
  function mountFixedToggle(){
    let fab = qs("#edn-toggle-fixed");
    if (!fab){
      fab = document.createElement("div");
      fab.id = "edn-toggle-fixed";
      fab.innerHTML = `<button type="button" data-lang="en">EN</button><button type="button" data-lang="es">ES</button>`;
      document.body.appendChild(fab);
    }
    // Force strong, inline styles so theme CSS can’t hide it
    fab.style.position = "fixed";
    fab.style.top = "10px";
    fab.style.right = "10px";
    fab.style.zIndex = "2147483647";
    fab.style.display = "flex";
    fab.style.gap = ".5rem";
    fab.style.pointerEvents = "auto";

    qsa("#edn-toggle-fixed button").forEach(b=>{
      b.style.cssText = "font-size:14px;font-weight:700;padding:.38rem .6rem;border-radius:.6rem;border:1px solid rgba(0,0,0,.25);background:#fff;color:#0b2239;cursor:pointer;user-select:none";
      b.classList.toggle("active", b.dataset.lang===getLang());
    });
  }

  /* ================== optional nav toggle (if there’s a nav) ================== */
  function mountNavToggle(){
    const host = qs("nav.site .wrap")||qs("nav .wrap")||qs("nav");
    if(!host) return;
    let bar = qs("#edn-lang");
    if(!bar){ bar = document.createElement("div"); bar.id="edn-lang"; host.appendChild(bar); }
    bar.innerHTML = `<button type="button" data-lang="en">EN</button><button type="button" data-lang="es">ES</button>`;
    bar.style.display="flex"; bar.style.gap="8px"; bar.style.marginLeft="12px";
    qsa("#edn-lang button").forEach(b=>{
      b.style.cssText="font-weight:700;border:1px solid rgba(0,0,0,.25);padding:6px 10px;border-radius:12px;background:#fff;color:#0b2c54;cursor:pointer";
      b.classList.toggle("active", b.dataset.lang===getLang());
    });
  }

  /* ================== translate data-i18n nodes (non-destructive) ================== */
  function applyI18n(){
    const d = dict();
    qsa("[data-i18n]").forEach(el=>{
      const k = el.getAttribute("data-i18n"); const val=d[k];
      if(!val) return;
      if(el.childNodes.length>1){
        for(const n of el.childNodes){ if(n.nodeType===3) n.nodeValue=val; }
      } else { el.textContent = val; }
    });
    // reflect active state on both toggles
    qsa("#edn-toggle-fixed button, #edn-lang button").forEach(b=>{
      b.classList.toggle("active", b.dataset.lang===getLang());
      if (b.classList.contains("active")){
        b.style.background = "#0b2239";
        b.style.color = "#fff";
        b.style.borderColor = "#0b2239";
      } else {
        b.style.background = "#fff";
        b.style.color = "#0b2239";
        b.style.borderColor = "rgba(0,0,0,.25)";
      }
    });
  }

  /* ================== event binding (capture so others can’t block) ================== */
  function bind(){
    const onPress=(e)=>{
      const btn = e.target.closest("#edn-toggle-fixed button, #edn-lang button");
      if(!btn) return;
      e.preventDefault();
      setLang(btn.dataset.lang);
      applyI18n();
    };
    document.addEventListener("click", onPress, {capture:true});
    document.addEventListener("touchstart", onPress, {capture:true, passive:false});
  }

  /* ================== self-heal if removed/hidden ================== */
  function watchdog(){
    // Re-mount every 1s if something removes or hides the widget
    setInterval(()=>{
      // Recreate fixed toggle if missing
      if(!qs("#edn-toggle-fixed")) mountFixedToggle();
      // If it exists but somehow hidden, re-assert style
      const fab = qs("#edn-toggle-fixed");
      if (fab){
        const cs = getComputedStyle(fab);
        if (cs.display==="none" || cs.visibility==="hidden" || cs.opacity==="0"){
          mountFixedToggle();
        }
      }
      // Keep nav toggle in sync if present
      mountNavToggle();
      applyI18n();
    }, 1000);
  }

  /* ================== boot ================== */
  function ready(){
    setLang(getLang());        // set initial language from storage
    mountFixedToggle();        // always-visible toggle
    mountNavToggle();          // optional nav toggle
    bind();                    // capture listeners
    applyI18n();               // translate any keyed text
    watchdog();                // keep it alive
  }

  (document.readyState==="loading") ? document.addEventListener("DOMContentLoaded", ready) : ready();
})();
