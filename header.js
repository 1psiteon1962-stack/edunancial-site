<!-- /header.js (replace entire file) -->
<script>
(function(){
  const routes = {
    en: [
      {href:"/index.html", label:"Our Story"},
      {href:"/membership.html", label:"Membership"},
      {href:"/membership-upgrade.html", label:"Upgrade"},
      {href:"/books.html", label:"Books"},
      {href:"/courses.html", label:"Courses"},
      {href:"/cart.html", label:"Cart"},
      {href:"/privacy.html", label:"Privacy"},
      {href:"/terms.html", label:"Terms"},
      {href:"/refund.html", label:"Refunds"}
    ],
    es: [
      {href:"/es-index.html", label:"Nuestra Historia"},
      {href:"/es-membership.html", label:"Membresía"},
      {href:"/es-membership-upgrade.html", label:"Mejorar"},
      {href:"/es-books.html", label:"Libros"},
      {href:"/es-courses.html", label:"Cursos"},
      {href:"/es-cart.html", label:"Carrito"},
      {href:"/privacy.html", label:"Privacidad"},  // (si tienes /es-privacy.html, cámbialo)
      {href:"/terms.html", label:"Términos"},       // (idem)
      {href:"/refund.html", label:"Reembolsos"}
    ],
  };

  function langOf(el){
    const v = (el && el.getAttribute('data-nav')) || 'en';
    return v === 'es' ? 'es' : 'en';
  }
  function otherLang(lang){ return lang==='es' ? 'en' : 'es'; }
  function pathFor(lang, href){
    // simple mapping: swap /es- prefix when switching
    const isEs = href.indexOf('/es-')===0;
    if(lang==='es' && !isEs){
      const name = href.replace(/^\//,'').replace(/\.html$/,'');
      return '/es-' + name + '.html';
    }
    if(lang==='en' && isEs){
      const name = href.replace(/^\/es-/,'/').replace(/\.html$/,'').replace(/^\//,'');
      return '/' + name + '.html';
    }
    return href;
  }

  function buildHeader(container){
    const lang = langOf(container);
    const links = routes[lang];
    const toggleLabel = (lang==='es') ? 'EN' : 'ES';

    const hdr = document.createElement('div');
    hdr.innerHTML = `
      <div style="background:#c40000;color:#000;padding:14px 10px">
        <div style="max-width:1100px;margin:0 auto;display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:space-between">
          <div style="font-weight:800;font-size:20px">Edunancial</div>
          <nav style="display:flex;gap:12px;flex-wrap:wrap">
            ${links.map(l=>`<a href="${l.href}" style="color:#000;text-decoration:none;font-weight:700">${l.label}</a>`).join('')}
          </nav>
          <button id="langToggle" aria-label="toggle language" style="background:#000;color:#fff;border:0;border-radius:10px;padding:8px 12px;font-weight:700;cursor:pointer">${toggleLabel}</button>
        </div>
      </div>
    `;
    container.appendChild(hdr);

    hdr.querySelector('#langToggle').addEventListener('click', ()=>{
      const curr = lang;
      const next = otherLang(curr);
      // try to switch to the “same” page if possible
      const here = location.pathname;
      const target = pathFor(next, here);
      location.href = target;
    });
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.site-header').forEach(buildHeader);
    // cart badge updater (optional)
    window.updateCartCount = function(){
      try{
        const c = JSON.parse(localStorage.getItem('edn_cart')||'[]');
        const count = c.reduce((n,x)=>n+(+x.qty||0),0);
        // add a small count next to Cart link
        document.querySelectorAll('a[href$="cart.html"]').forEach(a=>{
          a.textContent = (a.textContent.replace(/\s+\(\d+\)$/, '')) + (count ? ` (${count})` : '');
        });
      }catch(e){}
    };
    window.updateCartCount();
  });
})();
</script>
