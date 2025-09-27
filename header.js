// header.js v8 — injects red banner with EN/ES toggles, View Cart, and admin box.
// Also exposes EDN.updateCartCount() for cart badges.
(() => {
  const isES = () => location.pathname.startsWith('/es-');

  const LINKS_EN = [
    {href:'index.html',label:'Home'},
    {href:'books.html',label:'Books'},
    {href:'minicourses.html',label:'Mini-Courses'},
    {href:'membership.html',label:'Membership'},
    {href:'cart.html',label:'View Cart'}
  ];
  const LINKS_ES = [
    {href:'es-index.html',label:'Inicio'},
    {href:'es-books.html',label:'Libros'},
    {href:'es-minicourses.html',label:'Mini-Cursos'},
    {href:'es-membership.html',label:'Membresía'},
    {href:'es-cart.html',label:'Ver Carrito'}
  ];
  const links = isES() ? LINKS_ES : LINKS_EN;

  const css = `
  .site-header{position:sticky;top:0;z-index:1000;background:#cc0000;color:#000}
  .site-header .wrap{max-width:1000px;margin:0 auto;padding:10px 14px;display:flex;gap:12px;align-items:center;justify-content:space-between}
  .site-header a{color:#000;font-weight:800;text-decoration:none}
  .site-header nav{display:flex;gap:12px;flex-wrap:wrap}
  .hdr-right{display:flex;gap:10px;align-items:center}
  .pill{border:1px solid #000;border-radius:999px;padding:5px 12px;background:#000;color:#fff;font-weight:800}
  .pill.secondary{background:#fff;color:#000}
  .admin-inline{display:inline-flex;gap:6px;align-items:center}
  .admin-inline input{width:120px;padding:6px 8px;border:1px solid #e5e7eb;border-radius:8px}
  .admin-inline button{padding:6px 10px;border-radius:8px;border:1px solid #e5e7eb;background:#fff;cursor:pointer}
  @media (max-width:760px){.site-header nav{display:none}}
  `;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="wrap">
      <div class="brand"><a href="${isES()?'es-index.html':'index.html'}">Edunancial</a></div>
      <nav>${links.map(l=>`<a href="${l.href}">${l.label}</a>`).join('')}</nav>
      <div class="hdr-right">
        <a class="pill secondary" href="${isES()?'minicourses.html':'es-minicourses.html'}">${isES()?'EN':'ES'}</a>
        <form id="admin-inline" class="admin-inline" autocomplete="off">
          <input id="adminCodeInline" type="password" placeholder="admin"/>
          <button type="submit">→</button>
        </form>
      </div>
    </div>
  `;
  document.body.prepend(header);

  async function fetchCfg(){
    const res = await fetch('config.json?ts='+Date.now(), {cache:'no-store'});
    if(!res.ok) throw new Error('config.json missing');
    return res.json();
  }
  function saveAdmin(code){ try{ localStorage.setItem('edn_admin', code); }catch(e){} }

  // admin box behavior
  (async () => {
    const form = document.getElementById('admin-inline');
    const input = document.getElementById('adminCodeInline');
    const cfg = await fetchCfg().catch(()=>null);

    form.addEventListener('submit', async (e)=>{
      e.preventDefault();
      const code = (input.value||'').trim();
      const expected = cfg && (cfg.admin?.code || cfg.adminCode);
      if(code && expected && code === expected){
        saveAdmin(code);
        location.href = isES()? 'es-admin.html' : 'admin.html';
      }else{
        alert(isES()?'Código inválido':'Invalid code');
      }
    });
  })();

  // cart badge via document.title (optional)
  function updateCartCount(){
    let n=0; try{ n = JSON.parse(localStorage.getItem('edn_cart')||'[]').length }catch(e){}
    document.title = (n?`(${n}) `:'') + document.title.replace(/^\(\d+\)\s+/,'');
  }
  window.EDN = Object.assign(window.EDN||{}, {updateCartCount});
  updateCartCount();
})();
