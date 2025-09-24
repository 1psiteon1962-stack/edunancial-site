<script>
(()=>{ // EDUNANCIAL header + admin + cart
  const state={cfg:null};
  const isES=()=>/\/es-/.test(location.pathname);
  const file=()=>location.pathname.split('/').pop()||'index.html';
  const counterpart=()=>isES()?('/'+file().replace(/^es-/,'')):'/es-'+(file()||'index.html');

  async function loadCfg(){
    if(state.cfg) return state.cfg;
    const res=await fetch('/config.json?ts='+Date.now());
    state.cfg=await res.json();
    return state.cfg;
  }

  function injectHeader(){
    const css=`
      .site-header{position:sticky;top:0;z-index:9999;background:#d11;color:#fff;box-shadow:0 1px 0 rgba(0,0,0,.08)}
      .site-head-inner{max-width:980px;margin:0 auto;padding:10px 16px;display:flex;gap:14px;align-items:center;flex-wrap:wrap}
      .site-head-inner a{color:#fff;text-decoration:none;font-weight:600}
      .site-nav{display:flex;gap:14px;flex:1 1 auto}
      .pill{margin-left:auto;background:rgba(255,255,255,.18);padding:6px 10px;border-radius:999px}
      .pill:hover{background:rgba(255,255,255,.28)}
      .cart-pill{font-variant-numeric:tabular-nums}
    `;
    const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
    const h=document.createElement('header');h.className='site-header';
    h.innerHTML=`<div class="site-head-inner">
      <nav class="site-nav">
        <a href="/index.html">Edunancial</a>
        <a href="/books.html">Books</a>
        <a href="/courses.html">Courses</a>
        <a href="/payments.html">Payments</a>
        <a href="/call-center.html">Call Center</a>
        <a href="/vendor-program.html">Vendor</a>
        <a href="/contact.html">Contact</a>
        <a href="/privacy.html">Privacy</a>
        <a href="/terms.html">Terms</a>
        <a href="/refunds.html">Refunds</a>
      </nav>
      <a id="cart-link" class="pill cart-pill" href="/cart.html">Cart (<span id="cart-count">0</span>)</a>
      <a id="lang-toggle" class="pill" href="${counterpart()}">${isES()?'EN':'ES'}</a>
    </div>`;
    document.body.prepend(h);
  }

  function updateCartCount(){
    const cart=JSON.parse(localStorage.getItem('ednCart')||'[]');
    const count=cart.reduce((n,i)=>n+(i.qty||1),0);
    const cc=document.getElementById('cart-count');
    if(cc) cc.textContent=count;
  }

  function bindAdminForm(cfg){
    const form=document.getElementById('admin-form');
    if(!form) return;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const code=(document.getElementById('admin-code').value||'').trim();
      const ok=code && code===cfg.admin.code;
      const msg=document.getElementById('admin-msg');
      if(ok){
        localStorage.setItem('ednAdmin','1');
        if(msg){msg.textContent=isES()?'Modo administrador activo':'Admin mode on';msg.style.color='#1565d8';}
      }else{
        if(msg){msg.textContent=isES()?'Código inválido':'Invalid code';msg.style.color='#c00';}
      }
    });
  }

  document.addEventListener('DOMContentLoaded',async ()=>{
    injectHeader();
    updateCartCount();
    const cfg=await loadCfg();
    bindAdminForm(cfg);
    window.EDN={cfg,updateCartCount,isES};
  });
})();
</script>
