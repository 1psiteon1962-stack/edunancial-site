// header.js — shared red header with EN/ES toggle and simple nav
(function () {
  const P = window.location.pathname.replace(/^\//, "");          // e.g. "books.html"
  const isES = P.startsWith("es-");                                // Spanish page?
  const base = P.replace(/^es-/, "");                               // counterpart name without "es-"
  const current = base || "index.html";

  // Map each English page to its Spanish counterpart (and vice versa)
  const pairs = {
    "index.html": "es-index.html",
    "about.html": "es-about.html",
    "contact.html": "es-contact.html",
    "courses.html": "es-courses.html",
    "mini-courses.html": "es-mini-courses.html",
    "our-story.html": "es-our-story.html",
    "pamphlet.html": "es-pamphlet.html",
    "payments.html": "es-payments.html",
    "pricing.html": "es-pricing.html",
    "refunds.html": "es-refunds.html",
    "terms.html": "es-terms.html",
    "thank-you.html": "gracias.html",
    "books.html": "es-books.html",
    "checkout.html": "es-checkout.html",
    "videos.html": "es-videos.html"
  };

  // Build nav (same order on both languages; paths switch automatically)
  const navEN = [
    ["Home", "index.html"],
    ["Courses", "courses.html"],
    ["Books", "books.html"],
    ["Pricing", "pricing.html"],
  ];
  const navES = [
    ["Inicio", "es-index.html"],
    ["Cursos", "es-courses.html"],
    ["Libros", "es-books.html"],
    ["Precios", "es-pricing.html"],
  ];

  // Resolve link relative to current language
  function resolve(href) {
    if (isES) {
      // ensure Spanish version
      if (!href.startsWith("es-")) href = "es-" + href;
    } else {
      // ensure English version
      href = href.replace(/^es-/, "");
    }
    return "/" + href;
  }

  // Active page underlines
  function navHTML(items) {
    return items.map(([label, href]) => {
      const resolved = resolve(href);
      const isActive =
        ("/" + (isES ? ("es-" + current) : current)) === resolved;
      return `<a href="${resolved}"${isActive ? ' class="active"' : ""}>${label}</a>`;
    }).join("");
  }

  // Language counterparts for toggle
  const enHref = "/" + current;
  const esHref = "/" + (pairs[current] || ("es-" + current));

  // Inject styles + header
  const css = `
  <style>
    :root{--brand:#c81414;--ink:#000}
    .sitebar{background:var(--brand);color:var(--ink)}
    .sitebar .row{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:12px;padding:12px 16px}
    .brand{font-weight:900;letter-spacing:.5px}
    .spacer{flex:1}
    .nav a{color:#000;text-decoration:none;margin:0 10px;font-weight:800}
    .nav a.active{text-decoration:underline}
    .lang a{display:inline-block;border:2px solid #000;border-radius:10px;padding:5px 10px;margin-left:8px;text-decoration:none;color:#000;background:#fff;font-weight:800}
    @media (max-width:640px){.nav{display:none}}
  </style>`;

  const html = `
  <div class="sitebar">
    <div class="row">
      <div class="brand">EDUNANCIAL</div>
      <div class="spacer"></div>
      <nav class="nav">${isES ? navHTML(navES) : navHTML(navEN)}</nav>
      <div class="lang" aria-label="${isES ? "Idioma" : "Language"}">
        <a href="${enHref}"${!isES ? ' aria-current="page"' : ""}>EN</a>
        <a href="${esHref}"${isES ? ' aria-current="page"' : ""}>ES</a>
      </div>
    </div>
  </div>`;

  // Place header at top of body
  const mount = document.getElementById("sitebar");
  if (mount) mount.innerHTML = css + html;
  else document.body.insertAdjacentHTML("afterbegin", css + html);
})();
