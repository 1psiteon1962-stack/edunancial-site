/* header.js v5 — Edunancial site header + language toggle */

(function () {
  try {
    const isES =
      document.documentElement.lang === "es" ||
      /^\/es[-]/i.test(location.pathname);

    // Route map for EN <-> ES
    const map = (slug) => (isES ? `/es-${slug}.html` : `/${slug}.html`);
    const xmap = (path) => {
      // swap between /foo.html and /es-foo.html
      if (/^\/es-/.test(path)) return path.replace(/^\/es-/, "/");
      const name = path.replace(/^\//, "");
      if (!name) return "/index.html";
      if (!/-/.test(name)) return `/es-${name}`;
      if (name.endsWith(".html")) return `/es-${name.replace(".html", "")}.html`;
      return `/es-${name}.html`;
    };

    const to = (slug) => (slug === "index" ? (isES ? "/es-index.html" : "/index.html") : map(slug));

    const links = [
      { href: to("index"), label: isES ? "Inicio" : "Home" },
      { href: to("books"), label: isES ? "Libros" : "Books" },
      { href: to("courses"), label: isES ? "Cursos" : "Courses" },
      { href: to("payments"), label: isES ? "Pagos" : "Payments" },
      { href: to("call-center"), label: isES ? "Centro de Llamadas" : "Call Center" },
      { href: to("vendor-program"), label: isES ? "Programa de Vendedores" : "Vendor Program" },
      { href: to("contact"), label: isES ? "Contacto" : "Contact" },
      { href: to("privacy"), label: isES ? "Privacidad" : "Privacy" },
      { href: to("terms"), label: isES ? "Términos" : "Terms" },
      { href: to("refunds"), label: isES ? "Reembolsos" : "Refunds" },
      { href: to("our-story"), label: isES ? "Nuestra Historia" : "Our Story" }
    ];

    const header = document.getElementById("site-header") || (function(){
      const h = document.createElement("header");
      h.id = "site-header";
      document.body.prepend(h);
      return h;
    })();

    header.innerHTML = `
      <style>
        :root{
          --bg:#fff; --text:#111; --muted:#666;
          --border:#e6e6e6; --brand:#d11;
          --pill:#f3f3f3;
        }
        .site-header{display:flex;align-items:center;gap:20px;justify-content:space-between;
          padding:12px 16px;background:#fff;border-bottom:1px solid var(--border)}
        .site-header .logo{font-weight:800;letter-spacing:0.5px;color:#111}
        .site-header nav a{margin-right:12px;color:#111;text-decoration:none;font-weight:600}
        .lang-toggle{display:flex;gap:8px;align-items:center}
        .pill{padding:6px 10px;border-radius:999px;background:var(--pill);border:1px solid var(--border);
          cursor:pointer;font-weight:700}
        .pill.active{background:var(--brand);color:#fff;border-color:var(--brand)}
        /* buttons + cards (fallback if style.css fails) */
        .btn{display:inline-block;padding:10px 14px;border-radius:10px;background:#1565d8;color:#fff;
          text-decoration:none;font-weight:600;border:none;cursor:pointer}
        .link{color:#c00;text-decoration:none;font-weight:600}
        .card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:16px;
          box-shadow:0 1px 2px rgba(0,0,0,0.03)}
        .container{max-width:980px;margin:24px auto;padding:0 16px}
      </style>
      <div class="logo"><a href="${to("index")}" style="color:#111;text-decoration:none">EDUNANCIAL</a></div>
      <nav aria-label="${isES ? "Navegación principal" : "Primary navigation"}">
        ${links.map(l => `<a href="${l.href}">${l.label}</a>`).join("")}
      </nav>
      <div class="lang-toggle" role="group" aria-label="${isES ? "Idioma" : "Language"}">
        <button class="pill ${!isES ? "active":""}" data-lang="en">EN</button>
        <button class="pill ${isES ? "active":""}" data-lang="es">ES</button>
      </div>
    `;

    header.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lang]");
      if (!btn) return;
      const want = btn.getAttribute("data-lang");
      const target =
        want === "es"
          ? xmap(location.pathname).replace(/^\//, "/es-")
          : xmap(location.pathname).replace(/^\/es-/, "/");
      // Normalize double "es-es-" edge cases
      const cleaned = target.replace(/\/es-es-/i, "/es-");
      location.href = cleaned.endsWith(".html") ? cleaned : `${cleaned}.html`;
    });
  } catch (err) {
    console.error("header.js failed:", err);
  }
})();
