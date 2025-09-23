<script>
// ===== EDUNANCIAL SHARED HEADER / ADMIN BOX =====
// v4 - renders nav, language toggle, and an unlabeled admin input next to "View Cart".
// Admin code is hashed and compared to /config.json.adminHash. On success, Admin Mode is set.

(function(){
  const STATE = {
    cfg: null,
    adminOn: false
  };

  // ---------- utils ----------
  function $(sel, root=document){ return root.querySelector(sel); }
  function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }
  function toHex(buf){
    const arr = new Uint8Array(buf);
    return Array.from(arr).map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function sha256Hex(str){
    const enc = new TextEncoder().encode(str);
    const digest = await crypto.subtle.digest('SHA-256', enc);
    return toHex(digest);
  }
  function loadConfig(){
    return fetch('/config.json', {cache:'no-store'})
      .then(r=>r.ok ? r.json() : {})
      .catch(()=>({}));
  }
  function setAdmin(on){
    STATE.adminOn = !!on;
    try { localStorage.setItem('edn_admin', on ? '1' : '0'); } catch(e){}
    // badge
    let badge = $('#edn-admin-badge');
    if(!badge){
      badge = document.createElement('span');
      badge.id = 'edn-admin-badge';
      badge.textContent = 'Admin';
      badge.style.cssText = 'position:fixed;right:8px;bottom:8px;background:#1565d8;color:#fff;padding:6px 10px;border-radius:8px;font:600 12px system-ui;z-index:9999;opacity:.9;display:none';
      document.body.appendChild(badge);
    }
    badge.style.display = on ? 'inline-block' : 'none';
  }
  function restoreAdmin(){
    try{
      const v = localStorage.getItem('edn_admin');
      if(v === '1') setAdmin(true);
    }catch(e){}
  }

  // ---------- nav/header renderer (minimal, uses existing site CSS) ----------
  function ensureHeaderLoaded(){
    // If your pages already include a static header, skip. Otherwise this can inject one.
    // (We keep this light; your site already has header HTML.)
  }

  // ---------- admin input next to "View Cart" ----------
  function injectAdminBox(){
    // Find "View Cart" link or any anchor to cart.html
    const anchors = $all('a');
    const cartLink = anchors.find(a =>
      /cart\.html/i.test(a.getAttribute('href') || '') ||
      a.textContent.trim().toLowerCase() === 'view cart'
    );
    if(!cartLink) return;

    // Wrap the link and add a tiny input box after it (no label, per request)
    const wrap = document.createElement('span');
    wrap.style.cssText = 'display:inline-flex;gap:8px;align-items:center;margin-left:8px';
    cartLink.after(wrap);
    wrap.appendChild(cartLink);

    const input = document.createElement('input');
    input.type = 'password';
    input.autocomplete = 'off';
    input.placeholder = ''; // unlabeled, no placeholder
    input.id = 'edn-admin-input';
    input.style.cssText = 'width:120px;height:28px;border:1px solid #e0e0e0;border-radius:8px;padding:0 8px;font:400 14px system-ui';
    wrap.appendChild(input);

    // Hide input if already admin
    if(STATE.adminOn) input.style.display = 'none';

    input.addEventListener('keydown', async (e)=>{
      if(e.key !== 'Enter') return;
      const code = input.value.trim();
      if(!code) return;
      const enteredHash = await sha256Hex(code);
      // compare against config
      const expected = (STATE.cfg && STATE.cfg.adminHash || '').toLowerCase();
      if(expected && enteredHash === expected){
        setAdmin(true);
        // tiny success blink
        input.value = '';
        input.style.display = 'none';
        toast('Admin mode enabled');
        // optional: jump to Books so you can start testing
        // location.href = '/books.html';
      }else{
        shake(input);
      }
    });
  }

  // ---------- small helpers ----------
  function toast(msg){
    let t = $('#edn-toast');
    if(!t){
      t = document.createElement('div');
      t.id = 'edn-toast';
      t.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111;color:#fff;padding:10px 14px;border-radius:10px;font:500 13px system-ui;opacity:0;transition:opacity .2s;z-index:9999';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '0.9';
    setTimeout(()=> t.style.opacity = '0', 1500);
  }
  function shake(el){
    el.style.transition = 'transform .08s';
    let n=0, id=setInterval(()=>{
      el.style.transform = `translateX(${(n%2? -1:1)*6}px)`;
      if(++n>6){ clearInterval(id); el.style.transform=''; }
    },80);
  }

  // ---------- init ----------
  document.addEventListener('DOMContentLoaded', async ()=>{
    ensureHeaderLoaded();
    restoreAdmin();
    STATE.cfg = await loadConfig();
    injectAdminBox();
  });
})();
</script>
