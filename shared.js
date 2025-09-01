/* ========= Edunancial Shared Runtime =========
   Powers: EN/ES toggle, cookie consent + preferences,
           analytics (consent-aware), prelaunch waitlist,
           plan/course link wiring.
   Drop this file at site root and include on every page:
   <script src="shared.js?v=1"></script>
================================================ */

(function () {
  /* ----------------- CONFIG ----------------- */
  // Flip to false when Square checkout is live.
  const PRELAUNCH = true;

  // Optional banner note (e.g., bank holiday)
  const GO_LIVE_NOTE = "Payments resume after the bank holiday.";

  // Public contact
  const CONTACT_EMAIL = "hello@edunancial.com";

  // Pricing — set these to your Square Checkout URLs when live
  // (leave as "#" while PRELAUNCH = true; buttons will open the waitlist).
  const LINKS = {
    basic_m: "#", // $9/mo
    basic_y: "#", // $90/yr
    gold_m: "#",  // $19/mo
    gold_y: "#",  // $190/yr
    commit:  "#", // $57 upfront (3-month commitment), then $19/mo

    // Mini-courses
    biz:    "#",  // Business Formation $49
    real:   "#",  // Building Wealth with Assets $49
    investor:"#", // Thinking Like an Investor $49
  };

  // If you prefer GA4, swap the loadAnalyticsIfConsented() impl.
  const ANALYTICS = { type: "plausible", domain: "edunancial.com" };

  /* -------------- i18n Dictionary -------------- */
  const T = {
    en: {
      // nav + footer (already on pages)
      nav_home:"Home",nav_plans:"Plans",nav_courses:"Mini Courses",nav_story:"Our Story",nav_contact:"Contact",
      footer_privacy:"Privacy",footer_terms:"Terms",footer_refunds:"Refunds",footer_cookie:"Cookie Policy",
      footer_prefs:"Cookie Settings",footer_dns:"Do-Not-Sell/Share",footer_a11y:"Accessibility",footer_sec:"Security",
      edu_note:"Educational content only — not financial advice.",
      // home/hero
      hero_h1:"Financial literacy for everyone — bilingual and practical",
      hero_p:"Learn budgeting, credit, saving, and investing the clear way. Lessons, templates, and community — with flexible pricing.",
      cta_how:"How it works",cta_story:"Our story",cta_plans:"View plans",
      how_title:"How it works",how_1_t:"1. Learn",how_1_d:"Short EN/ES lessons with real examples and templates.",
      how_2_t:"2. Apply",how_2_d:"Use toolkit templates to budget, save, and invest.",
      how_3_t:"3. Grow",how_3_d:"Build habits, join tips, and level up.",
      // pricing
      plans_title:"Membership Plans",
      basic_title:"Basic",basic_desc:"Access to site, free pamphlet, no discounts.",
      gold_title:"Gold",gold_desc:"Includes mini courses, discounts, specials.",
      commit_title:"Gold Commitment",commit_desc:"Pay 3 months upfront ($57), then $19/mo.",
      // consent
      cc_title:"Your Privacy Choices",
      cc_desc:"Choose how we may use cookies and similar technologies.",
      cc_ess:"Essential (required)", cc_ana:"Analytics", cc_ads:"Advertising (not used)",
      cc_save:"Save", cc_cancel:"Cancel", cc_more:"Learn more",
      // waitlist
      wl_banner:"Payments go live soon — join the waitlist",
      wl_join:"Join Waitlist", wl_close:"Close",
      wl_title:"Get notified the moment payments go live",
      wl_desc:"Add your email and we’ll send you the link as soon as checkout opens. No spam.",
      wl_name:"Your name", wl_email:"Email", wl_submit:"Notify me", wl_thanks:"Thanks — you’re on the list!",
    },
    es: {
      nav_home:"Inicio",nav_plans:"Planes",nav_courses:"Mini cursos",nav_story:"Nuestra historia",nav_contact:"Contacto",
      footer_privacy:"Privacidad",footer_terms:"Términos",footer_refunds:"Reembolsos",footer_cookie:"Política de cookies",
      footer_prefs:"Preferencias de cookies",footer_dns:"No vender/compartir",footer_a11y:"Accesibilidad",footer_sec:"Seguridad",
      edu_note:"Contenido educativo — no es asesoría financiera.",
      hero_h1:"Educación financiera para todos — bilingüe y práctica",
      hero_p:"Aprende presupuesto, crédito, ahorro e inversión de forma clara. Lecciones, plantillas y comunidad — con precios flexibles.",
      cta_how:"Cómo funciona",cta_story:"Nuestra historia",cta_plans:"Ver planes",
      how_title:"Cómo funciona",how_1_t:"1. Aprende",how_1_d:"Lecciones EN/ES con ejemplos reales y plantillas.",
      how_2_t:"2. Aplica",how_2_d:"Usa plantillas para presupuestar, ahorrar e invertir.",
      how_3_t:"3. Crece",how_3_d:"Crea hábitos, únete a consejos y avanza.",
      plans_title:"Planes de membresía",
      basic_title:"Básico",basic_desc:"Acceso al sitio y folleto gratis, sin descuentos.",
      gold_title:"Oro",gold_desc:"Incluye minicursos, descuentos y promociones.",
      commit_title:"Compromiso Oro",commit_desc:"Paga 3 meses por adelantado ($57), luego $19/mes.",
      cc_title:"Tus opciones de privacidad",
      cc_desc:"Elige cómo podemos usar cookies y tecnologías similares.",
      cc_ess:"Esencial (requerido)", cc_ana:"Analítica", cc_ads:"Publicidad (no usamos)",
      cc_save:"Guardar", cc_cancel:"Cancelar", cc_more:"Saber más",
      wl_banner:"Los pagos vuelven pronto — únete a la lista",
      wl_join:"Unirme a la lista", wl_close:"Cerrar",
      wl_title:"Te avisamos cuando el pago esté activo",
      wl_desc:"Deja tu correo y te enviaremos el enlace apenas se habilite el pago. Sin spam.",
      wl_name:"Tu nombre", wl_email:"Correo", wl_submit:"Avisarme", wl_thanks:"¡Gracias! Ya estás en la lista!",
    }
  };

  /* -------------- i18n Helpers -------------- */
  const getLang = () => localStorage.getItem("lang") || "en";
  const setLang = (l) => { localStorage.setItem("lang", l); applyI18n(); };
  function t(key){ const L = T[getLang()] || T.en; return L[key] || key; }
  function applyI18n(){
    document.documentElement.lang = getLang();
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const k = el.getAttribute("data-i18n");
      if (T[getLang()][k]) el.textContent = T[getLang()][k];
    });
  }

  /* -------------- Consent & Analytics -------------- */
  const CONSENT_KEY = "edn-consent";
  const consentGet = () => localStorage.getItem(CONSENT_KEY) || "unset";
  const consentSet = (v) => localStorage.setItem(CONSENT_KEY, v);

  function loadAnalyticsIfConsented(){
    if (consentGet()!=="yes") return;
    try{
      if (ANALYTICS.type === "plausible") {
        const s = document.createElement("script");
        s.defer = true;
        s.setAttribute("data-domain", ANALYTICS.domain);
        s.src = "https://plausible.io/js/plausible.js";
        document.head.appendChild(s);
      }
      // else if GA4, inject GA here instead.
    }catch(e){}
  }

  function buildConsentUI(){
    // Banner for first-time visitors
    if (consentGet()==="unset"){
      const bar = document.createElement("div");
      bar.style.cssText = "position:sticky;bottom:0;z-index:9998;background:#0b2a4a;color:#fff;padding:10px 14px;display:flex;gap:8px;justify-content:center;align-items:center;flex-wrap:wrap";
      bar.innerHTML = `
        <span>${t('cc_desc')} <a href="cookie-policy.html" style="color:#fff;text-decoration:underline">${t('cc_more')}</a></span>
        <div style="display:flex;gap:8px">
          <button id="cc-accept" style="background:#2da44e;color:#fff;font-weight:800;border:0;border-radius:10px;padding:6px 12px">OK</button>
          <button id="cc-open" style="background:#fff;color:#0b2a4a;font-weight:800;border:0;border-radius:10px;padding:6px 12px">${t('footer_prefs')}</button>
        </div>`;
      document.body.appendChild(bar);
      document.getElementById("cc-accept").onclick = ()=>{ consentSet("yes"); bar.remove(); loadAnalyticsIfConsented(); };
      document.getElementById("cc-open").onclick = openPrefs;
    }

    // Preferences modal
    const wrap = document.createElement("div");
    wrap.id="cc-modal";
    wrap.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;z-index:10000";
    wrap.innerHTML = `
      <div style="max-width:520px;margin:12vh auto;background:#fff;border-radius:14px;padding:18px">
        <h3 style="margin-top:0">${t('cc_title')}</h3>
        <p>${t('cc_desc')}</p>
        <form id="cc-form" style="display:grid;gap:8px">
          <label><input type="checkbox" checked disabled> ${t('cc_ess')}</label>
          <label><input id="cc-ana" type="checkbox"> ${t('cc_ana')}</label>
          <label><input type="checkbox" disabled> ${t('cc_ads')}</label>
          <div style="display:flex;gap:8px;justify-content:flex-end">
            <button type="button" id="cc-cancel">${t('cc_cancel')}</button>
            <button type="submit" id="cc-save" style="background:#0b2a4a;color:#fff;border:0;border-radius:10px;padding:6px 12px;font-weight:800">${t('cc_save')}</button>
          </div>
        </form>
      </div>`;
    document.body.appendChild(wrap);

    document.getElementById("cc-cancel").onclick = ()=>{ wrap.style.display="none"; };
    document.getElementById("cc-form").onsubmit = (e)=>{
      e.preventDefault();
      const ana = document.getElementById("cc-ana").checked;
      consentSet(ana ? "yes" : "no");
      wrap.style.display="none";
      if (ana) loadAnalyticsIfConsented(); else location.reload();
    };

    // Footer “Cookie Settings” link
    const openPrefsLink = document.getElementById("openPrefs");
    if (openPrefsLink) openPrefsLink.onclick = openPrefs;

    function openPrefs(){ wrap.style.display="block"; document.getElementById("cc-ana").checked = (consentGet()==="yes"); }
    window.openPrefs = openPrefs; // optional global
  }

  /* -------------- Pre-launch Waitlist -------------- */
  function openWL(){ const m = document.getElementById("wl-modal"); if (m) m.style.display="block"; }
  function closeWL(){ const m = document.getElementById("wl-modal"); if (m) m.style.display="none"; }

  function buildWaitlist(){
    if (!PRELAUNCH) return;

    // Sticky banner
    const bar = document.createElement("div");
    bar.style.cssText="position:sticky;top:0;z-index:9997;background:#0b2a4a;color:#fff;padding:8px 12px;display:flex;gap:8px;justify-content:center;align-items:center;text-align:center;flex-wrap:wrap";
    bar.innerHTML = `<span style="font-weight:800">${t('wl_banner')}</span> <span style="opacity:.9">${GO_LIVE_NOTE}${CONTACT_EMAIL?' • '+CONTACT_EMAIL:''}</span>
      <button onclick="(${openWL.toString()})();" style="background:#e01e24;color:#fff;border:0;border-radius:10px;padding:6px 10px;font-weight:800;cursor:pointer">${t('wl_join')}</button>`;
    document.body.prepend(bar);

    // Modal
    const wrap = document.createElement("div");
    wrap.id="wl-modal";
    wrap.style.cssText="position:fixed;inset:0;background:rgba(0,0,0,.45);display:none;z-index:10000";
    wrap.innerHTML = `
      <div style="max-width:520px;margin:12vh auto;background:#fff;border-radius:14px;padding:18px">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <h3 style="margin:0">${t('wl_title')}</h3>
          <button onclick="(${closeWL.toString()})();" style="background:#fff;border:1px solid #e6e9ef;border-radius:10px;padding:6px 10px;cursor:pointer">${t('wl_close')}</button>
        </div>
        <p style="margin:.5rem 0 1rem 0;color:#444">${t('wl_desc')}</p>
        <form name="edn-waitlist" method="POST" data-netlify="true" style="display:grid;gap:10px">
          <input type="hidden" name="form-name" value="edn-waitlist">
          <label>${t('wl_name')}<input name="name" required style="width:100%;padding:12px;border:1px solid #e6e9ef;border-radius:12px"></label>
          <label>${t('wl_email')}<input name="email" type="email" required style="width:100%;padding:12px;border:1px solid #e6e9ef;border-radius:12px"></label>
          <button type="submit" style="padding:.8rem 1rem;border-radius:12px;border:0;font-weight:800;background:#e01e24;color:#fff;cursor:pointer">${t('wl_submit')}</button>
        </form>
        <p id="wl-thx" style="display:none;margin-top:10px;color:#0b7a2a;font-weight:700">${t('wl_thanks')}</p>
      </div>`;
    document.body.appendChild(wrap);

    // Ghost form for Netlify detection
    const ghost = document.createElement("form");
    ghost.setAttribute("name","edn-waitlist");
    ghost.setAttribute("netlify","");
    ghost.hidden = true;
    document.body.appendChild(ghost);

    // UX feedback
    wrap.querySelector("form").addEventListener("submit",()=>{
      setTimeout(()=>{ const thx = document.getElementById("wl-thx"); if (thx) thx.style.display="block"; }, 300);
      setTimeout(closeWL, 1800);
    });
  }

  /* -------------- Plan/Course Link Wiring -------------- */
  function wireLinks(){
    // Plans (pricing.html)
    document.querySelectorAll("[data-plan]").forEach(a=>{
      const key = a.getAttribute("data-plan");
      const href = LINKS[key] || "#";
      a.setAttribute("href", href);
      if (PRELAUNCH || href === "#") {
        a.addEventListener("click", (e)=>{ e.preventDefault(); openWL(); });
      }
    });
    // Courses (courses.html)
    document.querySelectorAll("[data-buy]").forEach(a=>{
      const key = a.getAttribute("data-buy");
      const href = LINKS[key] || "#";
      a.setAttribute("href", href);
      if (PRELAUNCH || href === "#") {
        a.addEventListener("click", (e)=>{ e.preventDefault(); openWL(); });
      }
    });
  }

  /* -------------- Boot -------------- */
  document.addEventListener("DOMContentLoaded", function(){
    // Language buttons
    document.querySelectorAll("[data-lang]").forEach(btn=>{
      btn.addEventListener("click", function(){
        document.querySelectorAll("[data-lang]").forEach(x=>x.removeAttribute("aria-current"));
        this.setAttribute("aria-current","true");
        setLang(this.getAttribute("data-lang"));
      });
    });

    // Apply translations
    applyI18n();

    // Consent UI + analytics
    buildConsentUI();
    loadAnalyticsIfConsented();

    // Waitlist if prelaunch
    buildWaitlist();

    // Wire pricing/course buttons
    wireLinks();
  });

})();
