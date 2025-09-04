/*!
 * Edunancial — EN/ES Toggle (desktop top-right, mobile bottom-right) v7
 * Single drop-in; no HTML changes required. Works across pages.
 */
(function () {
  "use strict";
  if (window.__EDN_READY_V7__) return;
  window.__EDN_READY_V7__ = true;

  const T = {
    en: {
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
    es: {
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

  const qs = (s,r=document)=>r.querySelector(s);
  const qsa = (s,r=document)=>Array.from(r.querySelectorAll(s));
  const getLang = () => { try { return localStorage.getItem("edn_lang") || "en"; } catch { return "en"; } };
  const setLang = (l) => { try { localStorage.setItem("edn_lang", l); } catch {} document.documentElement.setAttribute("lang", l); };
  const dict = () => T[getLang()] || T.en;

  function mountFixedToggle(){
    let box = qs("#edn-toggle-fixed");
    if(!box){
      box = document.createElement("div");
      box.id = "edn-toggle-fixed";
      box.innerHTML = `
        <button type="button" data-lang="en" aria-label="English">EN</button>
        <button type="button" data-lang="es" aria-label="Español">ES</button>`;
      document.body.appendChild(box);
    }
    // base style
    Object.assign(box.style, {
      position:"fixed", zIndex:"2147483647", display:"flex", gap:"8px",
      pointerEvents:"auto", filter:"drop-shadow(0 2px 6px rgba(0,0,0,.25))"
    });

    // mobile vs desktop placement (uses safe-area to dodge notches)
    function position(){
      const w = Math.min(window.innerWidth, screen.width || window.innerWidth);
      const isMobile = w <= 480;
      if(isMobile){
        box.style.top = "auto";
        box.style.right = "calc(env(safe-area-inset-right, 0px) + 12px)";
        box.style.bottom = "calc(env(safe-area-inset-bottom, 0px) + 14px)";
        box.style.left = "auto";
      }else{
        box.style.bottom = "auto";
        box.style.right = "calc(env(safe-area-inset-right, 0px) + 12px)";
        box.style.top = "calc(env(safe-area-inset-top, 0px) + 12px)";
        box.style.left = "auto";
      }
    }
    position();
    window.addEventListener("resize", position);
    window.addEventListener("orientationchange", position);

    qsa("#edn-toggle-fixed button").forEach(b=>{
      b.style.cssText = "font:700 13px/1.1 system-ui,Segoe UI,Roboto,Arial; padding:8px 10px; border-radius:14px; border:1px solid rgba(0,0,0,.25); background:#fff; color:#0b2239; cursor:pointer; min-width:44px; min-height:36px;";
      b.classList.toggle("active", b.dataset.lang===getLang());
    });
  }

  function mountNavToggle(){
    const host = qs("nav.site .wrap")||qs("nav .wrap")||qs("nav");
    if(!host) return;
    let bar = qs("#edn-lang"); if(!bar){ bar = document.createElement("div"); bar.id="edn-lang"; host.appendChild(bar); }
    bar.innerHTML = `<button type="button" data-lang="en">EN</button><button type="button" data-lang="es">ES</button>`;
    bar.style.display="flex"; bar.style.gap="8px"; bar.style.marginLeft="12px";
    qsa("#edn-lang button").forEach(b=>{
      b.style.cssText="font-weight:700;border:1px solid rgba(0,0,0,.25);padding:6px 10px;border-radius:12px;background:#fff;color:#0b2c54;cursor:pointer";
      b.classList.toggle("active", b.dataset.lang===getLang());
    });
  }

  function applyI18n(){
    const d = dict();
    qsa("[data-i18n]").forEach(el=>{
      const k = el.getAttribute("data-i18n"); if(!d[k]) return;
      if(el.childNodes.length>1){ for(const n of el.childNodes){ if(n.nodeType===3) n.nodeValue=d[k]; } }
      else { el.textContent = d[k]; }
    });
    // style active buttons
    qsa("#edn-toggle-fixed button, #edn-lang button").forEach(b=>{
      const on = b.dataset.lang===getLang();
      b.classList.toggle("active", on);
      b.style.background = on ? "#0b2239" : "#fff";
      b.style.color = on ? "#fff" : "#0b2239";
      b.style.borderColor = on ? "#0b2239" : "rgba(0,0,0,.25)";
    });
  }

  function bind(){
    const onPress = (e)=>{
      const btn = e.target.closest("#edn-toggle-fixed button, #edn-lang button");
      if(!btn) return;
      e.preventDefault();
      setLang(btn.dataset.lang);
      applyI18n();
    };
    document.addEventListener("click", onPress, {capture:true});
    document.addEventListener("touchstart", onPress, {capture:true, passive:false});
  }

  function watchdog(){
    setInterval(()=>{
      if(!qs("#edn-toggle-fixed")) mountFixedToggle();
      mountNavToggle();
      applyI18n();
    }, 1000);
  }

  function ready(){
    setLang(getLang());
    mountFixedToggle();
    mountNavToggle();
    bind();
    applyI18n();
    watchdog();
  }
  (document.readyState==="loading") ? document.addEventListener("DOMContentLoaded", ready) : ready();
})();
