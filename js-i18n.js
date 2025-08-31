// Global EN/ES i18n with persistence and safe initialization
(function () {
  const LANG_KEY = "udl_lang";
  const DEFAULT = "en";
  const DICT = {
    // nav / shared
    brand:{en:"Ultima Defensa Legal",es:"Última Defensa Legal"},
    "nav.home":{en:"Home",es:"Inicio"},
    "nav.pricing":{en:"Pricing",es:"Precios"},
    "nav.story":{en:"Our Story",es:"Nuestra Historia"},
    "nav.contact":{en:"Contact",es:"Contacto"},
    "nav.members":{en:"Member Portal",es:"Portal de Miembros"},
    // footer
    "footer.rights":{en:"All rights reserved.",es:"Todos los derechos reservados."},
    // index
    "hero.title":{en:"Legal help that speaks your language.",es:"Ayuda legal que habla tu idioma."},
    "hero.subtitle":{en:"Bilingual membership with access to local attorneys and real savings.",es:"Membresía bilingüe con acceso a abogados locales y ahorros reales."},
    "cta.join":{en:"Join Now",es:"Únete Ahora"},
    "cta.learn":{en:"Learn More",es:"Saber Más"},
    // pricing
    "pricing.title":{en:"Membership Pricing",es:"Precios de Membresía"},
    "pricing.note":{en:"Regional pricing applies automatically at checkout.",es:"Los precios regionales se aplican automáticamente al pagar."},
    "pricing.individual":{en:"Individual",es:"Individual"},
    "pricing.attorney":{en:"Attorney",es:"Abogado"},
    "pricing.attorney.note":{en:"Includes at least one free or reduced consultation required.",es:"Incluye al menos una consulta gratis o con descuento requerida."},
    "pricing.permonth":{en:"per month",es:"por mes"},
    "pricing.choose":{en:"Choose Plan",es:"Elegir Plan"},
    // story
    "story.title":{en:"How Ultima Defensa Legal Began",es:"Cómo Nació Última Defensa Legal"},
    // contact
    "contact.title":{en:"Contact Us",es:"Contáctanos"},
    "contact.msg":{en:"Send us a message and we’ll reply within 1 business day.",es:"Envíanos un mensaje y responderemos en 1 día hábil."},
    "contact.name":{en:"Your Name",es:"Tu Nombre"},
    "contact.email":{en:"Email",es:"Correo Electrónico"},
    "contact.message":{en:"Message",es:"Mensaje"},
    "contact.send":{en:"Send",es:"Enviar"},
    // legal pages (headings only; body text can remain bilingual blocks)
    "privacy.title":{en:"Privacy Notice",es:"Aviso de Privacidad"},
    "terms.title":{en:"Terms of Use",es:"Términos de Uso"},
    "cookies.title":{en:"Cookie Notice",es:"Aviso de Cookies"},
    "refunds.title":{en:"Refunds & Cancellations",es:"Reembolsos y Cancelaciones"},
    "security.title":{en:"Security",es:"Seguridad"},
    "access.title":{en:"Accessibility",es:"Accesibilidad"},
    "thanks.title":{en:"Thank You",es:"Gracias"},
    "gift.title":{en:"Member Gift",es:"Regalo para Miembros"},
    "admin.title":{en:"Admin",es:"Admin"},
    "404.title":{en:"Page not found",es:"Página no encontrada"},
  };

  function getLang() {
    const s = localStorage.getItem(LANG_KEY);
    if (s === "en" || s === "es") return s;
    const guess = (navigator.language||"en").toLowerCase().startsWith("es") ? "es" : "en";
    localStorage.setItem(LANG_KEY, guess);
    return guess;
  }
  function setLang(l){ localStorage.setItem(LANG_KEY,l); document.documentElement.setAttribute("lang",l);
    document.documentElement.classList.remove("lang-en","lang-es"); document.documentElement.classList.add("lang-"+l); }
  function t(lang){
    document.querySelectorAll("[data-i18n]").forEach(el=>{
      const key=el.getAttribute("data-i18n"); const entry=DICT[key]; if(!entry) return;
      const val=entry[lang]; if(el.tagName==="INPUT"&&el.placeholder!==undefined){el.placeholder=val;} else {el.textContent=val;}
    });
    const lbl=document.getElementById("lang-label"); if(lbl) lbl.textContent = (lang==="en"?"ES":"EN");
  }

  // set early for no-flash
  setLang(getLang());

  document.addEventListener("DOMContentLoaded",()=>{
    const lang=getLang(); t(lang);
    const btn=document.getElementById("lang-toggle");
    if(btn){ btn.addEventListener("click",()=>{ const next=getLang()==="en"?"es":"en"; setLang(next); t(next); }); }
  });
})();
