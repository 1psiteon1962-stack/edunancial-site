/* === Edunancial — classic layout with working mobile toggles === */
:root{
  --navy:#0e2a47; --navy-2:#163b62; --ink:#0b1322; --muted:#5e6f83;
  --red:#e0322b; --white:#ffffff; --blue:#0f2a44;
  --bg:#f6f8fc; --line:#e6eef7;
}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg)}

/* ===== Header (brand left, menu right, toggle always visible) ===== */
.site-header{position:sticky;top:0;z-index:60;background:var(--navy);color:#fff;box-shadow:0 2px 10px rgba(0,0,0,.08)}
.container{max-width:1100px;margin:0 auto;padding:0 16px}
.navbar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0}
.brand{color:#fff;text-decoration:none;font-size:1.2rem;font-weight:900;white-space:nowrap}

.menu{display:flex;align-items:center;gap:18px;min-width:0}
.menu a{color:#fff;text-decoration:none;font-weight:700;white-space:nowrap}
.menu-scroller{display:flex;gap:18px;min-width:0;overflow-x:auto;scrollbar-width:none}
.menu-scroller::-webkit-scrollbar{display:none}

/* Language toggle pinned at far right */
.lang{display:flex;gap:8px;flex-shrink:0}
.lang button{
  border:0;background:#fff;color:var(--navy);font-weight:900;
  padding:8px 12px;border-radius:999px;cursor:pointer;
  box-shadow:0 2px 6px rgba(0,0,0,.15)
}
.lang button.active{outline:2px solid #fff}

/* ===== Hero (original feel) ===== */
.hero{background:linear-gradient(180deg,var(--blue) 0%, var(--navy-2) 84%);color:#fff}
.hero .container{padding:34px 16px}
.hero h1{font-size:2rem;line-height:1.12;margin:0 0 12px}
.hero p{margin:0 0 10px;color:#e7effa}

.pills{display:flex;flex-wrap:wrap;gap:12px;margin-top:14px}
.pill{display:inline-block;padding:12px 18px;border-radius:999px;font-weight:900;text-decoration:none}
.pill-red{background:var(--red);color:#fff}
.pill-white{background:#fff;color:var(--blue)}
.pill-blue{background:#0e2a47;color:#fff}

/* ===== Sections / Cards ===== */
main{padding:22px 0}
h2{font-size:1.6rem;margin:0 0 8px}
.lead{color:#2b3c4f}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:18px}
.card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px}

/* Courses badges */
.badge{display:flex;align-items:center;justify-content:center;height:120px;border-radius:16px;font-weight:900;letter-spacing:.5px}
.badge.red{background:var(--red);color:#fff}
.badge.white{background:#fff;border:2px solid var(--blue);color:var(--blue)}
.badge.blue{background:var(--blue);color:#fff}

.btn{display:inline-block;margin-top:12px;padding:12px 16px;border-radius:999px;text-decoration:none;font-weight:900}
.btn-red{background:var(--red);color:#fff}
.btn-blue{background:var(--blue);color:#fff}

small.muted{color:var(--muted)}

/* ===== Language visibility ===== */
[data-lang]{display:none}
html[lang="en"] [data-lang="en"]{display:revert}
html[lang="es"] [data-lang="es"]{display:revert}

/* Larger screens */
@media (min-width:768px){
  .hero h1{font-size:2.6rem}
}
