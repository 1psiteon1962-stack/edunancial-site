<script>
/* Edunancial header/brand + red banner + language toggle
   Paste once; it renders on every page where <div id="sitebar"></div> exists. */

(function () {
  const isES = /^\/es-/.test(location.pathname);
  const t = isES ? {
    home:"Inicio", books:"Libros", courses:"Cursos", payments:"Pagos",
    callcenter:"Centro de Llamadas", vendor:"Programa de Vendedores",
    contact:"Contacto", privacy:"Privacidad", terms:"Términos",
    refunds:"Reembolsos", story:"Nuestra Historia"
  } : {
    home:"Home", books:"Books", courses:"Courses", payments:"Payments",
    callcenter:"Call Center", vendor:"Vendor Program",
    contact:"Contact", privacy:"Privacy", terms:"Terms",
    refunds:"Refunds", story:"Our Story"
  };

  const links = [
    { href: "/index.html",       label: t.home },
    { href: "/books.html",       label: t.books },
    { href: "/courses.html",     label: t.courses },
    { href: "/payments.html",    label: t.payments },
    { href: "/call-center.html", label: t.callcenter },
    { href: "/vendor.html",      label: t.vendor },
    { href: "/contact.html",     label: t.contact },
    { href: "/privacy.html",     label: t.privacy },
    { href: "/terms.html",       label: t.terms },
    { href: "/refunds.html",     label: t.refunds },
    { href: "/our-story.html",   label: t.story }
  ];

  const sitebar = document.getElementById('sitebar');
  if (!sitebar) return;

  // Convert links to ES if current page is Spanish
  const esPath = p => p.replace(/(^\/)(?!es-)(.*)\.html$/, "/es-$2.html");
  const enPath = p => p.replace(/(^\/)es-(.*)\.html$/, "/$2.html");
  const localized = links.map(l => ({...l, href: isES ? esPath(l.href) : l.href }));

  // Build HTML
  sitebar.innerHTML = `
    <header id="edn-header">
      <div class="wrap">
        <a class="brand" href="${isES ? "/es-index.html" : "/index.html"}">EDUNANCIAL</a>
        <nav>${localized.map(l=>`<a href="${l.href}">${l.label}</a>`).join('')}</nav>
        <div class="lang">
          <button id="lang-en" class="pill ${!isES?'active':''}">EN</button>
          <button id="lang-es" class="pill ${isES?'active':''}">ES</button>
        </div>
      </div>
    </header>
  `;

  // Styles (big red banner, black toggle with white text)
  const css = document.createElement('style');
  css.textContent = `
    #edn-header{background:#d60000;color:#000;position:sticky;top:0;z-index:9999;box-shadow:0 2px 6px rgba(0,0,0,.25)}
    #edn-header .wrap{max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:16px;padding:14px 12px}
    #edn-header .brand{font-weight:800;letter-spacing:.5px;color:#000;text-decoration:none;font-size:28px}
    #edn-header nav{display:flex;flex-wrap:wrap;gap:14px}
    #edn-header nav a{color:#000;text-decoration:none;font-weight:700}
    #edn-header nav a:hover{text-decoration:underline}
    #edn-header .lang{margin-left:auto;display:flex;gap:8px}
    #edn-header .pill{border-radius:999px;border:0;background:#000;color:#fff;font-weight:800;padding:10px 14px}
    #edn-header .pill.active{outline:3px solid #fff}
    @media(max-width:680px){
      #edn-header .wrap{flex-wrap:wrap;gap:10px}
      #edn-header nav{width:100%;gap:10px}
    }
  `;
  document.head.appendChild(css);

  // Toggle click
  document.getElementById('lang-en').onclick = () => {
    const target = enPath(location.pathname);
    if (location.pathname !== target) location.href = target;
  };
  document.getElementById('lang-es').onclick = () => {
    const target = esPath(location.pathname);
    if (location.pathname !== target) location.href = target;
  };
})();
</script>
