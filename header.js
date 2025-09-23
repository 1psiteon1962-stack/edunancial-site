/* Edunancial global header + admin unlock
   Replace your existing /header.js with this file.
   ------------------------------------------------
   CONFIG: paste SHA-256 (hex) of your admin code below.
*/
const ADMIN_HASH_HEX = "PUT_SHA256_OF_YOUR_ADMIN_CODE_HERE"; // 64 hex chars
const LS_ADMIN = "edn_admin";
const LS_MEMBER_TIER = "edn_member_tier";

/* ---------- tiny utils ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

async function sha256Hex(s){
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,"0")).join("");
}
function navLink(href, text){ return `<a href="${href}">${text}</a>`; }
function isES(){ return location.pathname.startsWith("/es-"); }
function swapLangPath(path){
  if (path.startsWith("/es-")) return path.replace("/es-","/");
  const file = path.split("/").pop() || "index.html";
  return "/es-" + file;
}

/* ---------- header HTML ---------- */
function headerHTML(){
  const es = isES();
  const t = (en,es) => (isES()? es : en);
  // links used sitewide
  const L = {
    home: t("/index.html","/es-index.html"),
    books: t("/books.html","/es-books.html"),
    courses: t("/courses.html","/es-courses.html"),
    payments: t("/payments.html","/es-payments.html"),
    call: t("/call-center.html","/es-call-center.html"),
    vendor: t("/vendor-program.html","/es-vendor-program.html"),
    contact: t("/contact.html","/es-contact.html"),
    privacy: t("/privacy.html","/es-privacy.html"),
    terms: t("/terms.html","/es-terms.html"),
    refunds: t("/refunds.html","/es-refunds.html"),
    ourstory: t("/our-story.html","/es-our-story.html"),
    cart: t("/cart.html","/es-cart.html")
  };

  return `
  <style>
    :root{--bg:#fff;--text:#111;--brand:#d11;--muted:#666;--border:#e6e6e6;}
    .site-header{display:flex;gap:20px;align-items:center;justify-content:space-between;
                 padding:12px 16px;background:#f7f7f7;border-bottom:1px solid var(--border);}
    .site-header .logo{font-weight:800;letter-spacing:.5px;text-transform:none;color:#111}
    .site-header nav a{margin-left:14px;text-decoration:none;color:#111}
    .site-header .lang{display:flex;gap:8px;align-items:center}
    .pill{border:none;cursor:pointer;background:#d11;color:#fff;font-weight:600;
          padding:6px 12px;border-radius:999px}
    .pill.muted{background:#eee;color:#111}
    /* admin box next to View Cart */
    .admin-box{margin-left:10px;padding:6px 10px;border:1px solid var(--border);
               border-radius:10px;width:150px}
    @media (max-width:768px){ .site-header nav{display:flex;flex-wrap:wrap;gap:10px} }
  </style>

  <header class="site-header">
    <div class="left">
      <a class="logo" href="${L.home}">EDUNANCIAL</a>
      <nav>
        ${navLink(L.books, t("Books","Libros"))}
        ${navLink(L.courses, t("Courses","Cursos"))}
        ${navLink(L.payments, t("Payments","Pagos"))}
        ${navLink(L.call, t("Call Center","Call Center"))}
        ${navLink(L.vendor, t("Vendor Program","Programa de Vendedores"))}
        ${navLink(L.contact, t("Contact","Contacto"))}
        ${navLink(L.privacy, t("Privacy","Privacidad"))}
        ${navLink(L.terms, t("Terms","Términos"))}
        ${navLink(L.refunds, t("Refunds","Reembolsos"))}
        ${navLink(L.ourstory, t("Our Story","Nuestra Historia"))}
        ${navLink(L.cart, t("View Cart","Ver Carrito"))}
      </nav>
    </div>
    <div class="lang">
      <button class="pill ${!isES()? "" : "muted"}" id="btnEN">EN</button>
      <button class="pill ${ isES()? "" : "muted"}" id="btnES">ES</button>
    </div>
  </header>
  `;
}

/* ---------- inject header once DOM ready ---------- */
function mountHeader(){
  if ($("#_edn_hdr")) return;
  const wrap = document.createElement("div");
  wrap.id = "_edn_hdr";
  wrap.innerHTML = headerHTML();
  document.body.prepend(wrap);

  // lang toggle
  $("#btnEN")?.addEventListener("click", () => {
    if (!isES()) return;
    location.href = swapLangPath(location.pathname);
  });
  $("#btnES")?.addEventListener("click", () => {
    if (isES()) return;
    location.href = swapLangPath(location.pathname);
  });

  injectAdminBox();
}

/* ---------- admin unlock next to "View Cart" ---------- */
function injectAdminBox(){
  const cartLink = $$(".site-header nav a").find(a=>{
    const t = (a.textContent||"").trim().toLowerCase();
    return t==="view cart" || t==="ver carrito";
  });
  if (!cartLink) return;

  const box = document.createElement("input");
  box.type = "password";
  box.className = "admin-box";
  box.placeholder = "";       // no description, per request
  box.autocomplete = "off";

  box.addEventListener("keydown", async (e)=>{
    if (e.key !== "Enter") return;
    const val = box.value.trim();
    if (!val) return;
    try{
      const hex = await sha256Hex(val);
      if (hex.toLowerCase() === ADMIN_HASH_HEX.toLowerCase()){
        localStorage.setItem(LS_ADMIN, "1");
        if (!localStorage.getItem(LS_MEMBER_TIER)) {
          localStorage.setItem(LS_MEMBER_TIER, "starter");
        }
        box.style.borderColor = "#0a7e07"; // silent success
        box.value = "";
        // unlocked; you can navigate & test discounts/payments
      }else{
        box.style.borderColor = "#c00";
        box.select();
      }
    }catch(_){}
  });

  cartLink.insertAdjacentElement("afterend", box);
}

/* ---------- boot ---------- */
if (document.readyState === "loading"){
  document.addEventListener("DOMContentLoaded", mountHeader);
}else{
  mountHeader();
}
