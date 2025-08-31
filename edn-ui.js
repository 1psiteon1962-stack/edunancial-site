/* edn-ui.js — site-wide UI helpers + i18n (EN/ES)
   - Stores language in localStorage("edn_lang")
   - Applies translations to all elements with [data-i18n]
   - Buttons with class "i18n-btn" and data-lang="en|es" switch language
*/
(function () {
  const KEY = "edn_lang";
  const I18N = {
    en: {
      nav_home: "Home",
      nav_how: "How it works",
      nav_story: "Our Story",
      nav_plans: "Plans",
      nav_contact: "Contact",
      hero_title: "Financial literacy for everyone — bilingual and practical",
      hero_sub:
        "Learn budgeting, credit, saving, and investing the clear way. Lessons, templates, and community — with flexible pricing.",
      cta_how: "How it works",
      cta_story: "Our story",
      cta_plans: "View plans",
      how_title: "How it works",
      how_1_t: "1. Learn",
      how_1_d:
        "Short EN/ES lessons with real examples and downloadable templates.",
      how_2_t: "2. Apply",
      how_2_d:
        "Use toolkit templates to budget, save, and start investing with confidence.",
      how_3_t: "3. Grow",
      how_3_d:
        "Build habits, join community tips, and level-up with advanced lessons.",
      plans_title: "Plans",
      plans_sub:
        "Clear, flexible pricing. You’ll see the final amount before checkout.",
      plan_basic: "Basic",
      plan_basic_desc:
        "Access to lessons, templates, and community. No discounts.",
      plan_gold: "Gold",
      plan_gold_desc:
        "Everything in Basic + member discounts, early-bird offers, and specials.",
      monthly: "Monthly",
      annually: "Annually",
      per_month: "/month",
      per_year: "/year",
      choose_plan: "Choose plan",
      upgrade_anytime: "You can upgrade anytime."
    },
    es: {
      nav_home: "Inicio",
      nav_how: "Cómo funciona",
      nav_story: "Nuestra historia",
      nav_plans: "Planes",
      nav_contact: "Contacto",
      hero_title:
        "Educación financiera para todos — bilingüe y práctica",
      hero_sub:
        "Aprende presupuesto, crédito, ahorro e inversión de forma clara. Lecciones, plantillas y comunidad — con precios flexibles.",
      cta_how: "Cómo funciona",
      cta_story: "Nuestra historia",
      cta_plans: "Ver planes",
      how_title: "Cómo funciona",
      how_1_t: "1. Aprende",
      how_1_d:
        "Lecciones EN/ES cortas con ejemplos reales y plantillas descargables.",
      how_2_t: "2. Aplica",
      how_2_d:
        "Usa el kit de plantillas para presupuestar, ahorrar y comenzar a invertir con confianza.",
      how_3_t: "3. Crece",
      how_3_d:
        "Crea hábitos, únete a consejos de la comunidad y sube de nivel con lecciones avanzadas.",
      plans_title: "Planes",
      plans_sub:
        "Precios claros y flexibles. Verás el monto final antes de pagar.",
      plan_basic: "Básico",
      plan_basic_desc:
        "Acceso a lecciones, plantillas y comunidad. Sin descuentos.",
      plan_gold: "Oro",
      plan_gold_desc:
        "Todo en Básico + descuentos para miembros, preventas y ofertas.",
      monthly: "Mensual",
      annually: "Anual",
      per_month: "/mes",
      per_year: "/año",
      choose_plan: "Elegir plan",
      upgrade_anytime: "Puedes mejorar en cualquier momento."
    }
  };

  function getLang() {
    try {
      return localStorage.getItem(KEY) || "en";
    } catch {
      return "en";
    }
  }
  function setLang(lang) {
    try {
      localStorage.setItem(KEY, lang);
    } catch {}
    applyLang(lang);
  }

  function translatePage(lang) {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const txt = I18N[lang] && I18N[lang][key];
      if (typeof txt === "string") el.textContent = txt;
    });
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent("edn:lang", { detail: lang }));
  }

  function markActive(lang) {
    document.querySelectorAll(".i18n-btn").forEach((btn) => {
      if (btn.getAttribute("data-lang") === lang) {
        btn.setAttribute("aria-current", "true");
        btn.style.opacity = "1";
        btn.style.fontWeight = "800";
      } else {
        btn.removeAttribute("aria-current");
        btn.style.opacity = ".6";
        btn.style.fontWeight = "600";
      }
    });
  }

  function applyLang(lang) {
    if (!I18N[lang]) lang = "en";
    translatePage(lang);
    markActive(lang);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const lang = getLang();
    applyLang(lang);

    // Bind all language toggle buttons
    document.querySelectorAll(".i18n-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-lang") || "en";
        setLang(target);
      });
    });
  });
})();
