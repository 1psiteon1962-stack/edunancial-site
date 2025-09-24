<script>
(()=>{ // EDN global header + cart + admin + toggle
  const state={cfg:null};
  const isES=()=>/\/es-/.test(location.pathname) || location.pathname.endsWith('/es-index.html');

  async function loadCfg(){
    if(state.cfg) return state.cfg;
    try{
      const r=await fetch('/config.json?ts='+Date.now());
      state.cfg=await r.json();
    }catch(e){
      state.cfg={site:{brandColor:'#d11',accentColor:'#1565d8'},admin:{code:''},discounts:{},products:{},memberships:{}};
    }
    return state.cfg;
  }

  function setStyles(cfg){
    const st=document.createElement('style');
    st.textContent=`:root{--brand:${cfg.site?.brandColor||'#d11'};--accent:${cfg.site?.accentColor||'#1565d8'}}`;
    document.head.appendChild(st);
  }

  function injectHeader(cfg){
    const h=document.createElement('header'); h.className='site-header';
    h.innerHTML=`<div class="wrap">
      <a class="site-logo" href="${isES()?'/es-index.html':'/index.html'}">EDUNANCIAL</a>
      <nav class="site-nav">
        <a href="${isES()?'/es-books.html':'/books.html'}">${isES()?'Libros':'Books'}</a>
        <a href="${isES()?'/es-courses.html':'/courses.html'}">${isES()?'Cursos':'Courses'}</a>
        <a href="${isES()?'/es-membership.html':'/membership.html'}">${isES()?'Membresía':'Membership'}</a>
        <a href="${isES()?'/es-cart.html':'/cart.html'}">${isES()?'Carrito':'Cart'} <span id="cart-count" class="cart-pill">(0)</span></a>
      </nav>
      <div class="tools">
        <a class="pill" id="lang">${isES()?'EN':'ES'}</a>
        <input id="admin-code" type="password" placeholder="" ${cfg.admin?.code?'':'style="display:none"'} />
        <button id="admin-go" ${cfg.admin?.code?'':'style="display:none"'}>Go</button>
      </div>
    </div>`;
    document.body.prepend(h);

    document.getElementById('lang').addEventListener('click',()=>{
      const file=(location.pathname.split('/').pop()||'index.html');
      if(isES()){ location.href='/'+file.replace(/^es-/,''); }
      else { location.href='/es-'+file; }
    });

    const btn=document.getElementById('admin-go');
    if(btn){
      btn.addEventListener('click',()=>{
        const v=(document.getElementById('admin-code').value||'').trim();
        if(v && v===cfg.admin.code){ localStorage.setItem('EDN_ADMIN','1'); alert(isES()?'Modo admin activo':'Admin mode on'); }
        else { alert(isES()?'Código inválido':'Invalid code'); }
      });
    }
  }

  function updateCartCount(){
    const cart=JSON.parse(localStorage.getItem('EDN_CART')||'[]');
    const n=cart.reduce((s,i)=>s+(i.qty||1),0);
    const el=document.getElementById('cart-count'); if(el) el.textContent='('+n+')';
  }

  // global addToCart
  function attachAPI(){
    window.EDN=window.EDN||{};
    window.EDN.addToCart=(sku)=>{
      const cfg=state.cfg||{};
      const p=cfg.products?.[sku];
      if(!p){ alert('Unknown SKU '+sku); return; }
      const item={sku, title:p.name, price: +p.price, qty:1};
      const cart=JSON.parse(localStorage.getItem('EDN_CART')||'[]'); cart.push(item);
      localStorage.setItem('EDN_CART', JSON.stringify(cart)); updateCartCount();
      alert((isES()?'Añadido: ':'Added: ')+p.name);
    };
    window.EDN.updateCartCount=updateCartCount;
  }

  document.addEventListener('DOMContentLoaded', async ()=>{
    const cfg=await loadCfg(); setStyles(cfg); injectHeader(cfg); attachAPI(); updateCartCount();
  });
})();
</script>
