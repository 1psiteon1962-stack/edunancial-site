// simple bilingual dictionary
const DICT = {
  en: {
    "site.name": "Edunancial Inc.",
    "nav.home": "Home",
    "nav.pricing": "Memberships",
    "nav.tools": "Tools",
    "nav.videos": "Videos",
    "nav.apply": "Apply",
    "hero.title": "Financial literacy, U.S. style — in English and Spanish.",
    "hero.subtitle": "Real estate, paper assets, and business growth for entrepreneurs, startups, and professionals.",
    "hero.cta1": "View memberships",
    "hero.cta2": "Our story",
    "hero.note": "U.S. legal focus. Payments via Square/Block (placeholder). Membership-gated tools.",
    "hero.tool1": "📈 Business Valuation (sample)",
    "hero.tool2": "💳 Credit Pathway (sample)",
    "hero.tool3": "🏠 Real Estate Analyzer (sample)",
    "hero.previewNote": "Full versions unlock after membership.",
    "newsletter.title": "Edunancial Growth Newsletter",
    "newsletter.desc": "Monthly U.S. business credit, tax, entity, and fintech partner insights. Add-on: automated SEO campaign.",
    "newsletter.starter": "Starter – $19/mo",
    "newsletter.pro": "Pro (with SEO tips) – $39/mo",
    "newsletter.exec": "Executive (with checklists) – $79/mo",
    "newsletter.btn": "Join newsletter",
    "seo.auto": "Automated SEO intake",
    "seo.autoDesc": "Members submit their business, site URL, keywords, and location. The system builds a monthly task list.",
    "seo.report": "Monthly reporting",
    "seo.reportDesc": "Rankings, backlinks, and tasks logged per client to prevent fraud or double-billing.",
    "seo.audit": "Human-level audit, later",
    "seo.auditDesc": "Once 30+ clients are enrolled you can add a part-time reviewer without changing the flow.",
    "memberships.title": "3 Memberships",
    "memberships.desc": "Priced for young entrepreneurs but expandable for advanced LinkedIn professionals.",
    "plan.basic": "Basic",
    "plan.pro": "Professional",
    "plan.exec": "Executive (Option)",
    "plan.basic.1": "Tool demos (non-working)",
    "plan.basic.2": "Newsletter starter",
    "plan.basic.3": "U.S. credit/vendor list (view)",
    "plan.pro.1": "Full tool access",
    "plan.pro.2": "SEO monthly tasks",
    "plan.pro.3": "Apply for cards/loans/real estate",
    "plan.exec.1": "Everything in Pro",
    "plan.exec.2": "Advanced tax / entity briefings",
    "plan.exec.3": "Attorney/insurance referral gate",
    "plan.btn": "Join",
    "plan.basic.note": "Nonprofits: $9.99 with code.",
    "footer.copy": "© " + new Date().getFullYear() + " Edunancial Inc. U.S. focus. All rights reserved.",
    "footer.juris": "Jurisdiction: State of Wyoming, U.S.A. — venue limited to the courts of the capital city.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.legal": "Legal"
  },
  es: {
    "site.name": "Edunancial Inc.",
    "nav.home": "Inicio",
    "nav.pricing": "Membresías",
    "nav.tools": "Herramientas",
    "nav.videos": "Videos",
    "nav.apply": "Solicitar",
    "hero.title": "Educación financiera al estilo de EE. UU. — en inglés y español.",
    "hero.subtitle": "Bienes raíces, activos en papel y crecimiento empresarial para emprendedores y profesionales.",
    "hero.cta1": "Ver membresías",
    "hero.cta2": "Nuestra historia",
    "hero.note": "Enfoque legal de EE. UU. Pagos vía Square/Block (marcador). Acceso por membresía.",
    "hero.tool1": "📈 Valuación de negocio (muestra)",
    "hero.tool2": "💳 Ruta de crédito (muestra)",
    "hero.tool3": "🏠 Analizador de bienes raíces (muestra)",
    "hero.previewNote": "Las versiones completas se activan con la membresía.",
    "newsletter.title": "Boletín de Crecimiento Edunancial",
    "newsletter.desc": "Crédito comercial, impuestos, entidades y fintech de EE. UU. cada mes. Opción: campaña SEO automática.",
    "newsletter.starter": "Inicial – $19/mes",
    "newsletter.pro": "Pro (con SEO) – $39/mes",
    "newsletter.exec": "Ejecutiva (con listas) – $79/mes",
    "newsletter.btn": "Suscribirse",
    "seo.auto": "SEO automático",
    "seo.autoDesc": "Los miembros envían su negocio, URL, palabras clave y ciudad. El sistema arma las tareas del mes.",
    "seo.report": "Reporte mensual",
    "seo.reportDesc": "Posiciones, enlaces y tareas registradas por cliente para evitar fraudes.",
    "seo.audit": "Revisión humana, después",
    "seo.auditDesc": "Cuando tenga 30+ clientes, puede agregar personal sin cambiar el flujo.",
    "memberships.title": "3 Membresías",
    "memberships.desc": "Para emprendedores jóvenes y también para profesionales avanzados.",
    "plan.basic": "Básica",
    "plan.pro": "Profesional",
    "plan.exec": "Ejecutiva (Opción)",
    "plan.basic.1": "Demos de herramientas",
    "plan.basic.2": "Boletín inicial",
    "plan.basic.3": "Lista de crédito/proveedores de EE. UU.",
    "plan.pro.1": "Acceso completo a herramientas",
    "plan.pro.2": "Tareas SEO mensuales",
    "plan.pro.3": "Solicitudes de tarjetas/préstamos/bienes raíces",
    "plan.exec.1": "Todo lo de Profesional",
    "plan.exec.2": "Informes de impuestos/entidades",
    "plan.exec.3": "Acceso a abogados/seguros",
    "plan.btn": "Unirse",
    "plan.basic.note": "ONG: $9.99 con código.",
    "footer.copy": "© " + new Date().getFullYear() + " Edunancial Inc. Enfoque EE. UU. Todos los derechos reservados.",
    "footer.juris": "Jurisdicción: Estado de Wyoming, EE. UU. — sede limitada a los tribunales de la capital.",
    "footer.privacy": "Privacidad",
    "footer.terms": "Términos",
    "footer.legal": "Legal"
  }
};

function setLang(lang) {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach(el => {
    const key = el.getAttribute("data-i18n");
    const value = DICT[lang][key];
    if (value) el.textContent = value;
  });
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("data-lang", lang);
  localStorage.setItem("edunancial_lang", lang);
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("edunancial_lang") || "en";
  setLang(saved);

  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setLang(btn.dataset.lang);
    });
  });

  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
