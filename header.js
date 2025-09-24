<script>
// header.js - include with <script src="/header.js?v=1" defer></script>
(() => {
  const state = { cfg: null };
  const isES = () => /\/es-/.test(location.pathname) || location.pathname.endsWith("/es-index.html");
  async function loadCfg(){
    try{
      const r = await fetch('/config.json?ts='+Date.now());
      state.cfg = await r.json();
    }catch(e){
      console.error('Failed to load config.json', e);
      state.cfg = { site:{brandColor:'#d11'} , admin:{code:''}, discounts:{} };
    }
    return state.cfg;
  }

  function createHeader(cfg){
    const brand = document.createElement('header');
    brand.className = 'site-header';
    brand.innerHTML = `
      <div class="container">
        <a class="logo" href="${isES()?'/es-index.html':'/index.html'}">EDUNANCIAL</a>
        <nav class="topnav">
          <a href="/books.html">Books</a>
          <a href="/courses.html">Courses</a>
          <a href="/cart.html">Cart <span id="cart-count">(0)</span></a>
          <a href="/membership.html">Membership</a>
          <a href="/contact.html">Contact</a>
        </nav>
        <div class="tools">
          <button id="lang-toggle">${isES()?'EN':'ES'}</button>
          <input id="admin-input" placeholder="admin code" style="display:none;width:120px;margin-left:12px" />
          <button id="admin-go" style="display:none;padding:6px 8px;margin-left:6px">Go</button>
        </div>
      </div>
    `;
    // basic colors via inline style
    const style = document.createElement('style');
    style.innerText = `
      :root{--brand:${cfg.site.brandColor||'#d11'};--accent:${cfg.site.accentColor||'#1565d8'};--text:#111;--muted:#666;--card:#fff;--border:#e6e6e6}
      .site-header{background:var(--brand);color:#fff;padding:10px 0}
      .site-header a.logo{font-weight:800;color:#fff;text-decoration:none;margin-left:14px}
      .site-header .container{display:flex;align-items:center;justify-content:space-between;max-width:980px;margin:0 auto;padding:4px}
      .topnav a{margin-right:12px;color:#fff;text-decoration:none}
      .tools{display:flex;align-items:center}
      @media (max-width:720px){ .topnav{display:none} }
    `;
    document.head.appendChild(style);
    document.body.prepend(brand);
    // toggle behavior
    document.getElementById('lang-toggle').addEventListener('click',()=>{
      if(isES()) location.href = location.pathname.replace('/es-','/').replace('es-','');
      else location.href = '/es-'+(location.pathname.split('/').pop() || 'index.html');
    });
    // admin input show if admin code present in config
    if(cfg.admin && cfg.admin.code){
      document.getElementById('admin-input').style.display = 'inline-block';
      document.getElementById('admin-go').style.display = 'inline-block';
      const adminInput = document.getElementById('admin-input');
      document.getElementById('admin-go').addEventListener('click',()=>{
        const v = adminInput.value.trim();
        if(!v){ alert('Enter code'); return; }
        if(v === cfg.admin.code){
          localStorage.setItem('EDN_ADMIN', v);
          alert('Admin code accepted');
          // show admin-only links by adding class or navigate to admin page
          location.reload();
        } else {
          alert('Code not recognized');
        }
      });
    }
    // update cart count helper exposed
  }

  // init
  (async ()=>{
    const cfg = await loadCfg();
    createHeader(cfg);
    // expose a simple helper for cart count
    window.EDN = { cfg, updateCartCount: ()=> {
      const c = JSON.parse(localStorage.getItem('EDN_CART')||'[]').length;
      const el = document.getElementById('cart-count');
      if(el) el.textContent = `(${c})`;
    }, isAdmin: ()=> localStorage.getItem('EDN_ADMIN') === cfg.admin.code };
    window.EDN.updateCartCount();
  })();
})();
</script>
