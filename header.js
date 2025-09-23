<!-- /header.js -->
<script>
(async function(){
  // Fallback styles so the red header never disappears
  const css = `
  :root{--brand:#d11;--bg:#fff;--text:#111;--border:#e6e6e6}
  body{margin:0;font:16px/1.5 system-ui,Segoe UI,Roboto,Arial,sans-serif;color:var(--text);background:var(--bg)}
  .site-header{display:flex;gap:16px;align-items:center;justify-content:space-between;padding:12px 16px;background:#d11;color:#fff}
  .site-header a{color:#fff;text-decoration:none;font-weight:600}
  .site-header .nav{display:flex;flex-wrap:wrap;gap:14px}
  .pill{background:#fff;color:#d11;border-radius:999px;padding:4px 10px;font-weight:700}
  .container{max-width:980px;margin:0 auto;padding:0 16px}
  .btn{display:inline-block;padding:10px 12px;border-radius:10px;border:1px solid var(--border);background:#1565d8;color:#fff;text-decoration:none;font-weight:600}
  .row{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
  .admin-input{width:110px;height:36px;border-radius:8px;border:1px solid var(--border);padding:0 10px}
  `;
  const s = document.createElement("style"); s.textContent = css; document.head.appendChild(s);

  window.EDN = window.EDN || {};

  // Load config.json for site values (cart currency etc.)
  let CONFIG = {};
  try{
    const res = await fetch("/config.json", { cache: "no-store" });
    if(res.ok) CONFIG = await res.json();
  }catch(_){}

  function cartCount(){
    try{ const c = JSON.parse(localStorage.getItem("edn_cart")||"[]"); return c.reduce((n,i)=>n+Number(i.qty||1),0); }
    catch(_){ return 0; }
  }

  function setLang(to){
    if(to==='es'){
      const p = location.pathname.replace(/^\/es-?/,'');
      location.href = "/es-" + (p || "index.html");
    } else {
      location.href = location.pathname.replace(/^\/es-?/, '/');
    }
  }

  EDN.adminLogin = async function(raw){
    const code = (raw || "").trim();
    if(!code) return;

    try{
      const res = await fetch("/.netlify/functions/admin-login", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({ code })
      });
      if(!res.ok){
        alert("Invalid admin code");
        return;
      }
      const { token } = await res.json();
      localStorage.setItem("edn_admin_token", token);
      // Visual confirmation (optional)
      const box = document.getElementById("edn-admin-box");
      if (box){ box.value = "✓"; setTimeout(()=>{ box.value=""; }, 900); }
      // Stay put; your gate script will already let you navigate everywhere
    }catch(e){
      alert("Admin login failed");
    }
  }

  // Render header if not present (keeps your existing header if you already insert one)
  if(!document.querySelector(".site-header")){
    const wrap = document.createElement("header");
    wrap.className = "site-header";
    wrap.innerHTML = `
      <div class="container row" style="justify-content:space-between;width:100%">
        <div class="row">
          <a href="/index.html" style="font-size:20px;font-weight:800;letter-spacing:.4px">EDUNANCIAL</a>
          <nav class="nav">
            <a href="/books.html">Books</a>
            <a href="/courses.html">Courses</a>
            <a href="/payments.html">Payments</a>
            <a href="/call-center.html">Call Center</a>
            <a href="/vendor-program.html">Vendor</a>
            <a href="/contact.html">Contact</a>
            <a href="/privacy.html">Privacy</a>
            <a href="/terms.html">Terms</a>
            <a href="/refunds.html">Refunds</a>
            <a href="/our-story.html">Our Story</a>
            <a href="/cart.html">Cart (${cartCount()})</a>
          </nav>
        </div>
        <div class="row">
          <a class="pill" href="javascript:void 0" onclick="(${setLang}).call(null,'en')">EN</a>
          <a class="pill" href="javascript:void 0" onclick="(${setLang}).call(null,'es')">ES</a>
        </div>
      </div>
    `;
    document.body.prepend(wrap);
  }
})();
</script>
