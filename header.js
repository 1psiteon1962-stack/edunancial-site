<script>
// EDUNANCIAL header + language toggle + cart count
(() => {
  const brand = { name: "EDUNANCIAL", color: "#d11" };
  const linksEN = [
    { href: "/index.html", label: "Home" },
    { href: "/books.html", label: "Books" },
    { href: "/courses.html", label: "Courses" },
    { href: "/payments.html", label: "Payments" },
    { href: "/call-center.html", label: "Call Center" },
    { href: "/vendor-program.html", label: "Vendor Program" },
    { href: "/contact.html", label: "Contact" },
    { href: "/privacy.html", label: "Privacy" },
    { href: "/terms.html", label: "Terms" },
    { href: "/refunds.html", label: "Refunds" },
    { href: "/our-story.html", label: "Our Story" }
  ];

  const linksES = [
    { href: "/es-index.html", label: "Inicio" },
    { href: "/es-books.html", label: "Libros" },
    { href: "/es-courses.html", label: "Cursos" },
    { href: "/es-payments.html", label: "Pagos" },
    { href: "/es-call-center.html", label: "Centro de Llamadas" },
    { href: "/es-vendor-program.html", label: "Programa de Proveedores" },
    { href: "/es-contact.html", label: "Contacto" },
    { href: "/es-privacy.html", label: "Privacidad" },
    { href: "/es-terms.html", label: "Términos" },
    { href: "/es-refunds.html", label: "Reembolsos" },
    { href: "/es-our-story.html", label: "Nuestra Historia" }
  ];

  const isES = () => /^\/es-/.test(location.pathname) || /\/es(?:$|\/)/.test(location.pathname);
  const navLinks = isES() ? linksES : linksEN;

  // inject styles once
  const css = `
  .site-header{position:sticky;top:0;z-index:1000;background:${brand.color};color:#fff;}
  .site-header .wrap{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:10px 14px;max-width:1060px;margin:0 auto}
  .site-header a{color:#fff;text-decoration:none;font-weight:600}
  .site-header .logo a{letter-spacing:.5px}
  .site-header nav{display:flex;flex-wrap:wrap;gap:10px}
  .site-header .lang{display:flex;gap:8px}
  .site-header .pill{border:1px solid rgba(255,255,255,.7);border-radius:999px;padding:4px 10px;font-size:13px;background:transparent}
  .site-header .pill.active{background:#fff;color:${brand.color}}
  @media (max-width:760px){
    .site-header nav{display:none}
    .site-header .wrap{gap:8px}
  }`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  // build header
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="wrap">
      <div class="logo"><a href="${isES()?'/es-index.html':'/index.html'}">${brand.name}</a></div>
      <nav>${navLinks.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}</nav>
      <div class="lang">
        <a class="pill ${!isES()?'active':''}" href="${location.pathname.replace(/^\/es-/, '/')}">EN</a>
        <a class="pill ${isES()?'active':''}" href="${isES()?location.pathname.replace(/^\/es-/, '/'):('/es-'+location.pathname.replace(/^\//,''))}">ES</a>
      </div>
    </div>
  `;
  document.body.prepend(header);

  // cart count in header title, if you want later:
  function updateCartCount(){
    try {
      const cart = JSON.parse(localStorage.getItem('edn_cart')||'[]');
      document.title = (cart.length?`(${cart.length}) `:'') + document.title.replace(/^\(\d+\)\s+/,'');
    }catch(e){}
  }
  updateCartCount();
  window.EDN = Object.assign(window.EDN||{}, {isES, updateCartCount});
})();
</script>
