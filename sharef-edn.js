/*!
 * Edunancial — site-wide EN/ES + theme helpers  v1
 * File: /shared-edn.js
 */
(function(){
  "use strict";
  if (window.__EDN_READY__) return; window.__EDN_READY__=true;

  /* ---------- i18n dictionary ---------- */
  const T = {
    en:{
      "nav.home":"Home","nav.books":"Books","nav.courses":"Mini-Courses","nav.contact":"Contact",
      "hero.title":"Learn money the practical way — red, white & blue.",
      "hero.sub":"Bilingual financial education focused on Real Estate, Paper Assets, and Business. Simple steps, real results.",
      "hero.cta.red":"Start with Real Estate (Red)","hero.cta.white":"Try Paper Assets (White)","hero.cta.blue":"Grow a Business (Blue)",
      "story.badge":"Our Story","story.title":"Why Edunancial?","story.p1":"We started Edunancial to make financial education simple, practical, and respectful. No hype. No guilt.",
      "story.p2":"Red, White and Blue is our framework: buy or control assets (Red), build liquid wealth (White), and run a profitable business (Blue).",
      "story.p3":"You deserve tools that work in English or Spanish, affordable plans, and options to act today.",
      "books.title":"Books (English & Español)","books.sub":"Full-color covers by track: Red = Real Estate, White = Paper Assets, Blue = Business.",
      "book.red.t":"Real Estate Fundamentals","book.red.d":"Step-by-step entry into property deals and financing.",
      "book.white.t":"Build Wealth with Paper Assets","book.white.d":"Cashflow from stocks, ETFs, and notes — rules you can use.",
      "book.blue.t":"Profit-First Business","book.blue.d":"Simple profit systems for small business owners.",
      "btn.buy":"Buy","btn.more":"Learn more",
      "courses.title":"Mini-Courses","courses.sub":"Live sessions — one theme each week. Join from your phone.",
      "course.red.t":"Oct 18 — Real Estate (Red)","course.white.t":"Oct 25 — Paper Assets (White)","course.blue.t":"Nov 8 — Business (Blue)",
      "course.cta":"Reserve seat",
      "audio.title":"Listen: Red, White & Blue messages",
      "audio.red":"There are many ways to buy real estate. The question is, what’s your plan? · Hay muchas maneras de comprar bienes raíces. La pregunta es, ¿cuál es su plan?",
      "audio.white":"Pay yourself first. Every pay you get take a percentage you can afford. Work towards 40%. · Páguese a usted mismo primero. Cada pago, separe un porcentaje que pueda permitirse. Trabaje hacia el 40%.",
      "audio.blue":"…in business you can make money and still be in bankruptcy court. That’s why business is about making Profit. · …en los negocios usted puede ganar dinero y aún estar en el tribunal de bancarrota. Por eso el negocio se trata de obtener Ganancia.",
      "disclaimer":"Edunancial does not provide legal or investment advice. Education only.",
      "pay.note":"Ready for Square. Replace the payment links below once your account is verified."
    },
    es:{
      "nav.home":"Inicio","nav.books":"Libros","nav.courses":"Mini-cursos","nav.contact":"Contacto",
      "hero.title":"Aprenda sobre dinero de forma práctica — rojo, blanco y azul.",
      "hero.sub":"Educación financiera bilingüe enfocada en Bienes Raíces, Activos de Papel y Negocios. Pasos simples, resultados reales.",
      "hero.cta.red":"Empiece con Bienes Raíces (Rojo)","hero.cta.white":"Pruebe Activos de Papel (Blanco)","hero.cta.blue":"Haga crecer un Negocio (Azul)",
      "story.badge":"Nuestra Historia","story.title":"¿Por qué Edunancial?","story.p1":"Creamos Edunancial para que la educación financiera sea simple, práctica y respetuosa. Sin exageraciones. Sin culpa.",
      "story.p2":"Rojo, Blanco y Azul es nuestro marco: comprar o controlar activos (Rojo), crear riqueza líquida (Blanco) y operar un negocio rentable (Azul).",
      "story.p3":"Usted merece herramientas que funcionen en inglés o español, planes accesibles y opciones para actuar hoy.",
      "books.title":"Libros (English & Español)","books.sub":"Portadas de color por ruta: Rojo = Bienes Raíces, Blanco = Activos de Papel, Azul = Negocios.",
      "book.red.t":"Fundamentos de Bienes Raíces","book.red.d":"Guía paso a paso para entrar a operaciones y financiamiento.",
      "book.white.t":"Construya Riqueza con Activos de Papel","book.white.d":"Flujo de efectivo con acciones, ETFs y pagarés — reglas prácticas.",
      "book.blue.t":"Negocio Enfocado en la Ganancia","book.blue.d":"Sistemas simples de utilidad para dueños de pequeños negocios.",
      "btn.buy":"Comprar","btn.more":"Saber más",
      "courses.title":"Mini-cursos","courses.sub":"Sesiones en vivo — un tema por semana. Únase desde su teléfono.",
      "course.red.t":"18 de oct — Bienes Raíces (Rojo)","course.white.t":"25 de oct — Activos de Papel (Blanco)","course.blue.t":"8 de nov — Negocios (Azul)",
      "course.cta":"Reservar",
      "audio.title":"Escuche: Mensajes Rojo, Blanco y Azul",
      "audio.red":"Hay muchas maneras de comprar bienes raíces. La pregunta es, ¿cuál es su plan? · There are many ways to buy real estate. The question is, what’s your plan?",
      "audio.white":"Páguese a usted mismo primero. Cada pago, separe un porcentaje que pueda permitirse. Trabaje hacia el 40%. · Pay yourself first. Every pay you get take a percentage you can afford. Work towards 40%.",
      "audio.blue":"…en los negocios usted puede ganar dinero y aún estar en el tribunal de bancarrota. Por eso el negocio se trata de obtener Ganancia. · …in business you can make money and still be in bankruptcy court. That’s why business is about making Profit.",
      "disclaimer":"Edunancial no brinda asesoría legal ni de inversión. Solo educación.",
      "pay.note":"Listo para Square. Reemplace abajo los enlaces de pago cuando su cuenta esté verificada."
    }
  };

  /* ---------- helpers ---------- */
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const getLang=()=>{try{return localStorage.getItem("edn_lang")||"en";}catch{return"en";}};
  const setLang=l=>{try{localStorage.setItem("edn_lang",l);}catch{};document.documentElement.setAttribute("lang",l);};
  const dict=()=>T[getLang()]||T.en;

  function t(key){ return (dict()[key]||`??${key}??`); }

  /* ---------- apply translations ---------- */
  function i18n(){
    qsa("[data-i18n]").forEach(el=>{
      const k=el.getAttribute("data-i18n");
      const val=t(k);
      if(!val) return;
      if(el.children.length){
        // replace only text nodes
        for(const n of el.childNodes){ if(n.nodeType===3) n.nodeValue = val; }
      }else{ el.textContent = val; }
    });
    document.title = t("hero.title");
    qsa("#edn-lang button").forEach(b=>b.classList.toggle("active",b.dataset.lang===getLang()));
  }

  /* ---------- mount language toggle ---------- */
  function mountToggle(){
    const bar = qs("#edn-lang"); if(!bar) return;
    bar.innerHTML = `
      <button data-lang="en" type="button">EN</button>
      <button data-lang="es" type="button">ES</button>
    `;
    bar.addEventListener("click",e=>{
      const btn = e.target.closest("button[data-lang]"); if(!btn) return;
      setLang(btn.dataset.lang); i18n();
    },{capture:true});
  }

  /* ---------- set nav active ---------- */
  function markActive(){
    const path = (location.pathname||"/").replace(/\/+$/,"/");
    qsa("nav .links a").forEach(a=>{
      const href = a.getAttribute("href")||"#";
      const norm = href.replace(/\/+$/,"/");
      a.classList.toggle("active", norm===path);
    });
  }

  /* ---------- ready ---------- */
  function ready(){
    mountToggle();
    setLang(getLang());
    i18n(); markActive();
  }
  (document.readyState==="loading")?document.addEventListener("DOMContentLoaded",ready):ready();
})();
