<script>
/* ==== Edunancial global header with EN/ES toggle (v2) ==== */

/* Map each English path to its Spanish twin (and back). */
const PAIRS = {
  "/": "/es-index.html",
  "/index.html": "/es-index.html",

  "/about.html": "/es-about.html",
  "/our-story.html": "/es-our-story.html",
  "/contact.html": "/es-contact.html",
  "/courses.html": "/es-courses.html",
  "/mini-courses.html": "/es-mini-courses.html",
  "/pricing.html": "/es-pricing.html",
  "/payments.html": "/es-payments.html",
  "/refunds.html": "/es-refunds.html",
  "/terms.html": "/es-terms.html",
  "/privacy.html": "/es-privacy.html",
  "/security.html": "/es-security.html",
  "/cookie-policy.html": "/es-cookie-policy.html",
  "/videos.html": "/es-videos.html",
  "/faq.html": "/es-faq.html",
  "/thank-you.html": "/es-thank-you.html",

  "/books.html": "/es-books.html",
  "/checkout.html": "/es-checkout.html",
  "/cart.html": "/es-cart.html",          /* optional: only if you add a cart page */

  // Spanish -> English
  "/es-index.html": "/index.html",
  "/es-about.html": "/about.html",
  "/es-our-story.html": "/our-story.html",
  "/es-contact.html": "/contact.html",
  "/es-courses.html": "/courses.html",
  "/es-mini-courses.html": "/mini-courses.html",
  "/es-pricing.html": "/pricing.html",
  "/es-payments.html": "/payments.html",
  "/es-refunds.html": "/refunds.html",
  "/es-terms.html": "/terms.html",
  "/es-privacy.html": "/privacy.html",
  "/es-security.html": "/security.html",
  "/es-cookie-policy.html": "/cookie-policy.html",
  "/es-videos.html": "/videos.html",
  "/es-faq.html": "/faq.html",
  "/es-thank-you.html": "/thank-you.html",

  "/es-books.html": "/books.html",
  "/es-checkout.html": "/checkout.html",
  "/es-cart.html": "/cart.html"
};

const isSpanish = location.pathname.startsWith("/es-");
const counterpart = PAIRS[location.pathname] || (isSpanish ? "/index.html" : "/es-index.html");

const bar = document.createElement("div");
bar.id = "edn-sitebar";
bar.innerHTML = `
  <div class="wrap">
    <a href="/" class="brand">EDUNANCIAL</a>
    <div class="spacer"></div>
    <a class="lang ${!isSpanish ? 'active' : ''}" href="${!isSpanish ? location.pathname : counterpart.replace('/index.html','/')}">EN</a>
    <a class="lang ${isSpanish ? 'active' : ''}" href="${isSpanish ? location.pathname : counterpart}">ES</a>
  </div>
`;
document.body.prepend(bar);

const css = document.createElement("style");
css.textContent = `
  #edn-sitebar{position:sticky;top:0;z-index:9999;background:#c10d0d;border-bottom:3px solid #000;}
  #edn-sitebar .wrap{max-width:1100px;margin:0 auto;padding:10px 14px;display:flex;align-items:center;gap:12px}
  #edn-sitebar .brand{font-weight:800;letter-spacing:.6px;color:#000;text-decoration:none;background:#ffdfdf;padding:6px 10px;border-radius:4px}
  #edn-sitebar .spacer{flex:1}
  #edn-sitebar .lang{font:600 12px/1.1 system-ui, -apple-system, Segoe UI, Roboto, Arial;color:#000;background:#fff;border:1px solid #000;padding:6px 9px;border-radius:4px;text-decoration:none;margin-left:8px}
  #edn-sitebar .lang.active{background:#000;color:#fff}
  @media (max-width:480px){#edn-sitebar .brand{font-size:12px}}
`;
document.head.appendChild(css);
</script>
