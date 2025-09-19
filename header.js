<script>
// ===== Edunancial header with EN/ES toggle (injects red bar on every page) =====
(function () {
  const map = {
    "index.html":"es-index.html",
    "books.html":"es-books.html",
    "courses.html":"es-courses.html",
    "mini-courses.html":"es-mini-courses.html",
    "pricing.html":"es-pricing.html",
    "payments.html":"es-payments.html",
    "checkout.html":"es-checkout.html",
    "contact.html":"es-contact.html",
    "privacy.html":"es-privacy.html",
    "terms.html":"es-terms.html",
    "refunds.html":"es-refunds.html",
    "security.html":"es-security.html",
    "cookie-policy.html":"es-cookie-policy.html",
    "videos.html":"es-videos.html",
    "thank-you.html":"es-thank-you.html",
    "our-story.html":"es-our-story.html",
    "about.html":"es-about.html",
    "books.html":"es-books.html"
  };

  const isES = location.pathname.split("/").pop().startsWith("es-");
  const current = location.pathname.split("/").pop() || "index.html";
  const counterpart = isES
     ? current.replace(/^es-/, "")
     : (map[current] || ("es-" + current));

  // build header
  const root = document.getElementById("sitebar");
  if (!root) return;

  root.id = "edn-sitebar";
  root.innerHTML = `
    <div class="bar">
      <div class="brand">EDUNANCIAL</div>
      <nav>
        <a href="/index.html">${isES ? "Inicio" : "Home"}</a>
        <a href="/books.html">${isES ? "Libros" : "Books"}</a>
        <a href="/courses.html">${isES ? "Cursos" : "Courses"}</a>
        <a href="/pricing.html">${isES ? "Precios" : "Pricing"}</a>
        <a href="/contact.html">${isES ? "Contacto" : "Contact"}</a>
      </nav>
      <div class="spacer"></div>
      <div class="lang">
        <button data-lang="EN" class="${!isES ? "active":""}">EN</button>
        <button data-lang="ES" class="${isES ? "active":""}">ES</button>
      </div>
    </div>
  `;

  root.querySelectorAll('.lang button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      if (btn.dataset.lang === 'EN' && isES) {
        location.href = "/" + counterpart.replace(/^es-/, "");
      }
      if (btn.dataset.lang === 'ES' && !isES) {
        location.href = "/" + counterpart;
      }
    });
  });
})();
</script>
