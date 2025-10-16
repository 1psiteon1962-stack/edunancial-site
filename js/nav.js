<script>
/* Edunancial unified nav + language toggle
   - Injects a consistent header on every page
   - Switches links to EN/ES paths automatically
   - Fixes Spanish toggles (no more 404s)
*/

(function () {
  const lang = (document.documentElement.lang || "en").toLowerCase().startsWith("es") ? "es" : "en";

  // Map each “main” page to its EN/ES twin
  const twins = {
    "/our-story.html":            { en: "/our-story.html",           es: "/nuestra-historia.html" },
    "/nuestra-historia.html":     { en: "/our-story.html",           es: "/nuestra-historia.html" },

    "/movement.html":             { en: "/movement.html",            es: "/movimiento.html" },
    "/movimiento.html":           { en: "/movement.html",            es: "/movimiento.html" },

    "/memberships-level1.html":   { en: "/memberships-level1.html",  es: "/membresias-nivel1.html" },
    "/membresias-nivel1.html":    { en: "/memberships-level1.html",  es: "/membresias-nivel1.html" },

    "/memberships-level2.html":   { en: "/memberships-level2.html",  es: "/membresias-nivel2.html" },
    "/membresias-nivel2.html":    { en: "/memberships-level2.html",  es: "/membresias-nivel2.html" },

    "/videos.html":               { en: "/videos.html",              es: "/videos-es.html" },
    "/videos-es.html":            { en: "/videos.html",              es: "/videos-es.html" },

    "/catalog.html":              { en: "/catalog.html",             es: "/catalogo.html" },
    "/catalogo.html":             { en: "/catalog.html",             es: "/catalogo.html" },

    "/contact.html":              { en: "/contact.html",             es: "/es-contact.html" },
    "/es-contact.html":           { en: "/contact.html",             es: "/es-contact.html" },

    "/free-resources.html":       { en: "/free-resources.html",      es: "/recursos-gratis.html" },
    "/recursos-gratis.html":      { en: "/free-resources.html",      es: "/recursos-gratis.html" },

    "/index.html":                { en: "/our-story.html",           es: "/nuestra-historia.html" },
    "/index-es.html":             { en: "/our-story.html",           es: "/nuestra-historia.html" }
  };

  // Detect current path and find its twin; default to Our Story
  const path = location.pathname.replace(/\/+$/, "").toLowerCase() || "/our-story.html";
  const twin = twins[path] || twins["/our-story.html"];

  // Helper: choose language-specific href
  const L = (hrefEN, hrefES) => lang === "es" ? hrefES : hrefEN;

  const html = `
    <nav class="site-nav-inner">
      <a class="brand" href="${L("/our-story.html","/nuestra-historia.html")}">Edunancial</a>
      <div class="links">
        <a href="${L("/our-story.html","/nuestra-historia.html")}">${L("Our Story","Nuestra Historia")}</a>
        <a href="${L("/movement.html","/movimiento.html")}">${L("Start Learning","Empieza a Aprender")}</a>
        <a href="${L("/memberships-level1.html","/membresias-nivel1.html")}">${L("Memberships","Membresías")}</a>
        <a href="${L("/videos.html","/videos-es.html")}">${L("Videos","Videos")}</a>
        <a href="${L("/catalog.html","/catalogo.html")}">${L("Catalog","Catálogo")}</a>
        <a href="${L("/contact.html","/es-contact.html")}">${L("Contact","Contacto")}</a>
      </div>
      <div class="lang">
        <a class="chip ${lang==='en'?'active':''}" href="${twin.en}">EN</a>
        <a class="chip ${lang==='es'?'active':''}" href="${twin.es}">ES</a>
      </div>
    </nav>
  `;

  const host = document.getElementById("site-header") || (function () {
    const h = document.createElement("header");
    h.id = "site-header";
    document.body.insertBefore(h, document.body.firstChild);
    return h;
  })();

  host.className = "site-nav";
  host.innerHTML = html;
})();
</script>
