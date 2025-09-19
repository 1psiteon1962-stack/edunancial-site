<script>
(function () {
  const lang = location.pathname.startsWith('/es-') ? 'es' : 'en';

  const bar = document.createElement('div');
  bar.id = 'edn-sitebar';
  bar.innerHTML = `
    <div class="wrap">
      <a class="brand" href="${lang==='es'?'/es-index.html':'/index.html'}">EDUNANCIAL</a>
      <nav class="nav">
        <a href="${lang==='es'?'/es-index.html':'/index.html'}">${lang==='es'?'Inicio':'Home'}</a>
        <a href="${lang==='es'?'/es-books.html':'/books.html'}">${lang==='es'?'Libros':'Books'}</a>
        <a href="${lang==='es'?'/es-courses.html':'/courses.html'}">${lang==='es'?'Cursos':'Courses'}</a>
        <a href="${lang==='es'?'/es-our-story.html':'/our-story.html'}">${lang==='es'?'Nuestra Historia':'Our Story'}</a>
        <a href="${lang==='es'?'/es-contact.html':'/contact.html'}">${lang==='es'?'Contacto':'Contact'}</a>
      </nav>
      <div class="lang">
        <a href="${location.pathname.replace('/es-','/')}" class="${lang==='en'?'active':''}">EN</a>
        <a href="${
          location.pathname.startsWith('/es-')
            ? location.pathname
            : location.pathname.replace('/','/es-')
        }" class="${lang==='es'?'active':''}">ES</a>
      </div>
    </div>
  `;
  document.body.prepend(bar);

  // Footer with legal links
  const f = document.createElement('div');
  f.className = 'footer';
  f.innerHTML = `
    <div class="wrap">
      <span>© Edunancial</span>
      <span class="spacer"></span>
      <a href="${lang==='es'?'/es-privacy.html':'/privacy.html'}">${lang==='es'?'Privacidad':'Privacy'}</a>
      <a href="${lang==='es'?'/es-terms.html':'/terms.html'}">${lang==='es'?'Términos':'Terms'}</a>
      <a href="${lang==='es'?'/es-refunds.html':'/refunds.html'}">${lang==='es'?'Reembolsos':'Refunds'}</a>
    </div>`;
  document.body.appendChild(f);

  // Inject CSS (pairs with style.css but works even if that’s cached)
  const css = document.createElement('style');
  css.textContent = `
    #edn-sitebar{position:sticky;top:0;z-index:999;background:#c40000;border-bottom:3px solid #000}
    #edn-sitebar .wrap{max-width:1100px;margin:0 auto;padding:10px 14px;display:flex;align-items:center;gap:14px}
    #edn-sitebar .brand{font-weight:800;letter-spacing:.6px;color:#000;text-decoration:none}
    #edn-sitebar .nav{display:flex;gap:14px;flex-wrap:wrap}
    #edn-sitebar .nav a{color:#000;text-decoration:none}
    #edn-sitebar .nav a:hover{text-decoration:underline}
    #edn-sitebar .lang{margin-left:auto;display:flex;gap:6px}
    #edn-sitebar .lang a{border:1px solid #000;padding:2px 6px;border-radius:6px;color:#000;text-decoration:none}
    #edn-sitebar .lang a.active{background:#000;color:#fff}
    .container{max-width:1100px;margin:18px auto;padding:0 14px}
    .card{background:#fff;border:1px solid #eee;border-radius:12px;padding:18px}
    .btn{display:inline-block;background:#0a53c1;color:#fff;border-radius:10px;padding:10px 14px;text-decoration:none}
    .btn.outline{background:#fff;color:#0a53c1;border:2px solid #0a53c1}
    .footer{margin-top:40px;border-top:1px solid #eee}
    .footer .wrap{max-width:1100px;margin:0 auto;padding:14px;display:flex;gap:14px;align-items:center}
    .footer .wrap a{color:#0a53c1;text-decoration:none}
    .footer .wrap .spacer{flex:1}
    @media (max-width:600px){#edn-sitebar .nav{display:none}}
  `;
  document.head.appendChild(css);
})();
</script>
