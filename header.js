<script>
// header.js v6 — compact red banner with mobile menu + always-visible EN/ES + Cart badge

(function () {
  const PAGES = [
    { href: "/books.html", label: "Books", es: "/es-books.html" },
    { href: "/courses.html", label: "Courses", es: "/es-courses.html" },
    { href: "/payments.html", label: "Payments", es: "/es-payments.html" },
    { href: "/call-center.html", label: "Call Center", es: "/es-call-center.html" },
    { href: "/vendor-program.html", label: "Vendor Program", es: "/es-vendor-program.html" },
    { href: "/contact.html", label: "Contact", es: "/es-contact.html" },
    { href: "/privacy.html", label: "Privacy", es: "/es-privacy.html" },
    { href: "/terms.html", label: "Terms", es: "/es-terms.html" },
    { href: "/refunds.html", label: "Refunds", es: "/es-refunds.html" },
    { href: "/our-story.html", label: "Our Story", es: "/es-our-story.html" },
  ];

  const isES = location.pathname.startsWith("/es-");
  const t = (en, es) => (isES ? es : en);

  // Map nav links to current language
  const navLinks = PAGES.map(p => {
    const href = isES && p.es ? p.es : p.href;
    const label = t(p.label, ({
      "Books":"Libros","Courses":"Cursos","Payments":"Pagos","Call Center":"Call Center",
      "Vendor Program":"Programa de Vendedores","Contact":"Contacto","Privacy":"Privacidad",
      "Terms":"Términos","Refunds":"Reembolsos","Our Story":"Nuestra Historia"
    })[p.label] || p.label);
    return { href, label };
  });

  // Language URLs
  function swapLangUrl(toES) {
    const path = location.pathname.replace(/^\/+/, "");
    if (toES) {
      if (path.startsWith("es-")) return "/" + path;
      const esPath = "/es-" + path;
      return esPath;
    } else {
      if (path.startsWith("es-")) return "/" + path.replace(/^es-/, "");
      return "/" + path;
    }
  }

  // Cart count from localStorage
  function getCartCount() {
    try {
      const cart = JSON.parse(localStorage.getItem("edn_cart") || "[]");
      return Array.isArray(cart) ? cart.reduce((n, item)=> n + (item.qty || 1), 0) : 0;
    } catch { return 0; }
  }

  const header = document.getElementById("site-header");
  if (!header) return;

  header.innerHTML = `
    <div class="site-header__bar">
      <a class="site-header__logo" href="${t('/index.html','/es-index.html')}">EDUNANCIAL</a>

      <button class="site-header__menuBtn" aria-label="${t('Open menu','Abrir menú')}" aria-expanded="false">☰</button>

      <nav class="site-header__nav" aria-label="Primary">
        ${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}
        <a href="${t('/cart.html','/es-cart.html')}" class="site-header__cart">
          ${t('Cart','Carrito')} <span class="site-header__badge" id="cartBadge">${getCartCount()}</span>
        </a>
      </nav>

      <div class="site-header__lang">
        <a class="pill ${!isES ? 'active' : ''}" href="${swapLangUrl(false)}">EN</a>
        <a class="pill ${isES ? 'active' : ''}" href="${swapLangUrl(true)}">ES</a>
      </div>
    </div>

    <div class="site-header__drawer" hidden>
      ${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}
      <a href="${t('/cart.html','/es-cart.html')}" class="site-header__drawerCart">
        ${t('Cart','Carrito')} <span class="site-header__badge" id="cartBadge2">${getCartCount()}</span>
      </a>
    </div>
  `;

  // Menu toggle (mobile)
  const btn = header.querySelector(".site-header__menuBtn");
  const drawer = header.querySelector(".site-header__drawer");
  btn.addEventListener("click", () => {
    const open = drawer.hasAttribute("hidden") ? false : true;
    if (open) {
      drawer.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
    } else {
      drawer.removeAttribute("hidden");
      btn.setAttribute("aria-expanded", "true");
    }
  });

  // Keep cart badge fresh
  window.addEventListener("storage", (e) => {
    if (e.key === "edn_cart") {
      const n = getCartCount();
      const b1 = header.querySelector("#cartBadge");
      const b2 = header.querySelector("#cartBadge2");
      if (b1) b1.textContent = n;
      if (b2) b2.textContent = n;
    }
  });
})();
</script>
