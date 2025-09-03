<!-- =============================================
FILE: /assets/css/styles.css
Purpose: Shared styles. Clean, mobile-first. Buttons labeled “Pay/Pagar”.
NOTE: No provider names appear in the UI per requirement.
============================================== -->:root{ --bg: #0a0a0a; --fg:#f5f5f5; --muted:#c9c9c9; --accent:#2563eb; --accent-2:#16a34a; --card:#111; --border:#2a2a2a; --warn:#f59e0b; --danger:#ef4444; --radius: 1rem; --shadow: 0 10px 25px rgba(0,0,0,.25); --maxw: 1120px; } *{box-sizing:border-box} html,body{margin:0;padding:0;background:var(--bg);color:var(--fg);font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial} a{color:inherit;text-decoration:none} img{max-width:100%;display:block} .container{max-width:var(--maxw);margin:0 auto;padding:16px} .header{position:sticky;top:0;backdrop-filter:saturate(160%) blur(8px);background:rgba(10,10,10,.6);border-bottom:1px solid var(--border);z-index:40} .nav{display:flex;align-items:center;gap:12px;justify-content:space-between} .brand{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.3px} .brand .logo{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#ef4444,#ffffff,#3b82f6);box-shadow:var(--shadow)} .navlinks{display:flex;gap:14px;align-items:center} .lang-toggle{display:flex;gap:8px;align-items:center;border:1px solid var(--border);border-radius:999px;padding:6px} .lang-toggle button{border:none;background:transparent;color:var(--muted);padding:6px 10px;border-radius:999px;cursor:pointer} .lang-toggle button.active{background:var(--accent);color:white} .badge{font-size:12px;border:1px solid var(--border);padding:2px 8px;border-radius:999px;color:var(--muted)} .hero{display:grid;gap:18px;padding:48px 0} .hero h1{font-size:clamp(28px,5vw,48px);line-height:1.05;margin:0} .hero p{color:var(--muted);margin:0} .cards{display:grid;grid-template-columns:repeat(12,1fr);gap:16px} .card{grid-column:span 12;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--shadow)} .plan{display:flex;flex-direction:column;gap:14px} .price{font-size:28px;font-weight:800} .actions{display:flex;gap:10px;flex-wrap:wrap} .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--border);border-radius:12px;padding:12px 16px;cursor:pointer;transition:transform .06s ease} .btn:active{transform:translateY(1px)} .btn-primary{background:var(--accent);color:white} .btn-success{background:var(--accent-2);color:white} .btn-muted{background:#1a1a1a;color:var(--muted)} .footer{margin-top:56px;padding:30px 0;color:var(--muted);border-top:1px solid var(--border)} .kicker{font-size:13px;color:var(--muted)} .notice{display:none;margin:8px 0 0;font-size:13px} .notice.show{display:block} .banner{background:linear-gradient(90deg,rgba(245,158,11,.2),rgba(37,99,235,.2));border:1px dashed var(--warn);padding:8px 12px;border-radius:10px} .grid-2{display:grid;grid-template-columns:1fr;gap:16px} @media(min-width:780px){.card{grid-column:span 6}.grid-2{grid-template-columns:repeat(2,1fr)}}

/* Utilities */ .hidden{display:none!important} .small{font-size:12px;color:var(--muted)} .hr{height:1px;background:var(--border);margin:16px 0}

/* Link underline on focus */ :focus-visible{outline:2px solid var(--accent);outline-offset:2px}

/* Sandbox watermark */ .test-banner{position:fixed;bottom:16px;right:16px;background:var(--warn);color:#111;padding:8px 10px;border-radius:10px;font-weight:700;box-shadow:var(--shadow);z-index:50}

/* Language-safe tooltip (for optional BTC) */ .tooltip{position:relative} .tooltip:hover .tip{opacity:1;transform:translateY(0)} .tip{pointer-events:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translate(-50%,6px);display:block;background:#111;border:1px solid var(--border);padding:6px 8px;border-radius:8px;color:var(--muted);opacity:0;transition:.15s}

/* Region chip (hidden word) */ .region-chip{border:1px solid var(--border);border-radius:999px;padding:2px 8px} .region-label{display:none}

/* Honeypot */ .hp{position:absolute;left:-10000px;top:auto;width:1px;height:1px;overflow:hidden}

/* Simple table */ .table{width:100%;border-collapse:collapse} .table th,.table td{border-bottom:1px solid var(--border);padding:10px;text-align:left} -->

<!-- =============================================
FILE: /assets/js/i18n.js
Purpose: Robust cross-page bilingual switch with URL ?lang=, localStorage fallback,
         and auto-propagation of lang parameter across internal links.
============================================== -->(function(){ const LS_KEY = 'ed_lang'; const DEFAULT = 'en'; const url = new URL(window.location.href); const qLang = url.searchParams.get('lang'); const stored = localStorage.getItem(LS_KEY); const lang = (qLang || stored || DEFAULT).toLowerCase();

function persist(l){ localStorage.setItem(LS_KEY, l); const u = new URL(window.location.href); u.searchParams.set('lang', l); window.history.replaceState({}, '', u.toString()); }

// Simple i18n dictionary. Extend freely. const t = { en: { nav_home: 'Home', nav_pricing: 'Pricing', nav_about: 'About', nav_terms:'Terms', nav_privacy:'Privacy', hero_title: 'Bilingual financial literacy for real people', hero_sub: 'Courses, books, and tools to help you build wealth the simple way.', plans_header: 'Memberships', plan_basic_name: 'Basic', plan_basic_desc: 'Starter access to downloads and updates.', plan_premium_name: 'Premium', plan_premium_desc: 'Full library access + future add-ons.', price_month: '/month', pay: 'Pay', pay_btc: 'Pay (Bitcoin)', legal_disclaimer: 'Educational content only. Not financial, legal, or tax advice.', sandbox_msg: 'TEST MODE — payments use sandbox links', region_word_hidden: '', region_us: 'United States', region_pr: 'Puerto Rico', region_dr: 'Dominican Republic' }, es: { nav_home: 'Inicio', nav_pricing: 'Precios', nav_about: 'Acerca', nav_terms:'Términos', nav_privacy:'Privacidad', hero_title: 'Educación financiera bilingüe para gente real', hero_sub: 'Cursos, libros y herramientas para ayudarte a crear riqueza de forma sencilla.', plans_header: 'Membresías', plan_basic_name: 'Básica', plan_basic_desc: 'Acceso inicial a descargas y actualizaciones.', plan_premium_name: 'Premium', plan_premium_desc: 'Acceso a toda la biblioteca + futuros añadidos.', price_month: '/mes', pay: 'Pagar', pay_btc: 'Pagar (Bitcoin)', legal_disclaimer: 'Contenido educativo. No es asesoría financiera, legal ni fiscal.', sandbox_msg: 'MODO PRUEBA — pagos usan enlaces de sandbox', region_word_hidden: '', region_us: 'Estados Unidos', region_pr: 'Puerto Rico', region_dr: 'República Dominicana' } };

function applyTranslations(current){ const dict = t[current] || t[DEFAULT]; document.querySelectorAll('[data-i18n]').forEach(el=>{ const key = el.getAttribute('data-i18n'); if(dict[key]) el.textContent = dict[key]; }); // Update buttons across pages document.querySelectorAll('[data-i18n-attr]')?.forEach(el=>{ const mapping = el.getAttribute('data-i18n-attr'); // e.g. title:pay mapping.split(',').forEach(pair=>{ const [attr,k] = pair.split(':'); if(t[current][k]) el.setAttribute(attr, t[current][k]); }); }) }

function updateLinks(current){ const u = new URL(window.location.href); document.querySelectorAll('a[href^="/"] , a[href$=.html]').forEach(a=>{ try{ const href = new URL(a.getAttribute('href'), window.location.origin + window.location.pathname); href.searchParams.set('lang', current); // keep mode & region if present if(u.searchParams.get('mode')) href.searchParams.set('mode', u.searchParams.get('mode')); if(u.searchParams.get('r')) href.searchParams.set('r', u.searchParams.get('r')); a.setAttribute('href', href.pathname + '?' + href.searchParams.toString()); }catch(e){} }); }

function setActiveToggle(current){ document.querySelectorAll('[data-lang-btn]')?.forEach(btn=>{ btn.classList.toggle('active', btn.getAttribute('data-lang-btn')===current); }) }

window.ED_LANG = { get: ()=>lang, set: (next)=>{ applyTranslations(next); updateLinks(next); setActiveToggle(next); persist(next); } };

// init applyTranslations(lang); updateLinks(lang); setActiveToggle(lang); })();

<!-- =============================================
FILE: /assets/js/payments.js
Purpose: Route “Pay” buttons to the correct checkout link by MODE (sandbox|live),
         REGION (us|pr|dr), PLAN (basic|premium), METHOD (card|btc).
         No provider names in UI. Uses placeholders for you to paste real links.
============================================== -->(function(){ const LS_MODE = 'ed_mode'; const LS_REGION = 'ed_region'; const u = new URL(window.location.href); const mode = (u.searchParams.get('mode') || localStorage.getItem(LS_MODE) || 'sandbox').toLowerCase(); const region = (u.searchParams.get('r') || localStorage.getItem(LS_REGION) || 'us').toLowerCase();

function persist(){ localStorage.setItem(LS_MODE, mode); localStorage.setItem(LS_REGION, region); } persist();

// TODO: Paste your LIVE and SANDBOX checkout URLs below for each region & plan const CONFIG = { mode, region, checkout: { us: { basic:   { live: 'https://square.link/u/US_BASIC_LIVE',   sandbox: 'https://square.link/u//success.html?test=1&plan=basic&region=us' }, premium: { live: 'https://square.link/u/US_PREMIUM_LIVE', sandbox: '/success.html?test=1&plan=premium&region=us' } }, pr: { basic:   { live: 'https://square.link/u/PR_BASIC_LIVE',   sandbox: 'https://square.link/u//success.html?test=1&plan=basic&region=pr' }, premium: { live: 'https://square.link/u/PR_PREMIUM_LIVE', sandbox: '/success.html?test=1&plan=premium&region=pr' } }, dr: { basic:   { live: 'https://square.link/u/DR_BASIC_LIVE',   sandbox: 'https://square.link/u//success.html?test=1&plan=basic&region=dr' }, premium: { live: 'https://square.link/u/DR_PREMIUM_LIVE', sandbox: '/success.html?test=1&plan=premium&region=dr' } } }, crypto: { basic:   { url: 'https://commerce.coinbase.com/checkout/BASIC_XXXX' }, premium: { url: 'https://commerce.coinbase.com/checkout/PREMIUM_XXXX' } } };

function getCardUrl(plan){ const r = CONFIG.region in CONFIG.checkout ? CONFIG.region : 'us'; const bundle = CONFIG.checkout[r][plan]; return bundle ? bundle[CONFIG.mode === 'sandbox' ? 'sandbox' : 'live'] : '#'; }

function getCryptoUrl(plan){ return CONFIG.crypto[plan]?.url || '#'; }

function pay(plan, method){ const href = method === 'btc' ? getCryptoUrl(plan) : getCardUrl(plan); if(!href || href === '#'){ alert('Checkout link missing.'); return; } window.location.href = href; }

// Expose globally window.ED_PAY = { pay };

// Show TEST banner if sandbox if(CONFIG.mode === 'sandbox'){ const div = document.createElement('div'); div.className = 'test-banner'; div.setAttribute('data-i18n','sandbox_msg'); div.textContent = 'TEST MODE — payments use sandbox links'; document.body.appendChild(div); } })();

<!-- =============================================
FILE: /index.html
Purpose: Landing with hero + quick pricing and Pay buttons.
Notes:  - Uses i18n.js for language
        - Uses payments.js for routing Pay buttons
        - Carries ?lang, ?mode, ?r across page links automatically
============================================== --><!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Edunancial</title>
  <meta name="description" content="Bilingual financial literacy. Simple, actionable, trusted." />
  <link rel="preload" href="/assets/css/styles.css" as="style" />
  <link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body>
  <header class="header">
    <div class="container nav">
      <div class="brand">
        <div class="logo" aria-hidden="true"></div>
        <span>Edunancial</span>
        <span class="badge region-chip" title=""><span class="region-label" data-i18n="region_word_hidden"></span><span id="regionName" class="small"></span></span>
      </div>
      <nav class="navlinks">
        <a href="/index.html" data-i18n="nav_home">Home</a>
        <a href="/pricing.html" data-i18n="nav_pricing">Pricing</a>
        <a href="/about.html" data-i18n="nav_about">About</a>
        <a href="/terms.html" data-i18n="nav_terms">Terms</a>
        <a href="/privacy.html" data-i18n="nav_privacy">Privacy</a>
        <div class="lang-toggle" role="group" aria-label="Language">
          <button data-lang-btn="en" onclick="ED_LANG.set('en')">EN</button>
          <button data-lang-btn="es" onclick="ED_LANG.set('es')">ES</button>
        </div>
      </nav>
    </div>
  </header>  <main class="container">
    <section class="hero">
      <h1 data-i18n="hero_title">Bilingual financial literacy for real people</h1>
      <p class="kicker" data-i18n="hero_sub">Courses, books, and tools to help you build wealth the simple way.</p>
      <div class="banner small" id="note"></div>
    </section><section>
  <h2 data-i18n="plans_header">Memberships</h2>
  <div class="cards">
    <article class="card plan">
      <div>
        <div class="small" data-i18n="plan_basic_name">Basic</div>
        <div class="price">$5 <span class="small" data-i18n="price_month">/month</span></div>
        <p class="small" data-i18n="plan_basic_desc">Starter access to downloads and updates.</p>
      </div>
      <div class="actions">
        <button class="btn btn-primary" data-i18n="pay" onclick="ED_PAY.pay('basic','card')">Pay</button>
        <span class="tooltip">
          <button class="btn btn-muted" data-i18n="pay_btc" data-i18n-attr="title:pay_btc" onclick="ED_PAY.pay('basic','btc')">Pay (Bitcoin)</button>
          <span class="tip">Crypto option</span>
        </span>
      </div>
    </article>
    <article class="card plan">
      <div>
        <div class="small" data-i18n="plan_premium_name">Premium</div>
        <div class="price">$15 <span class="small" data-i18n="price_month">/month</span></div>
        <p class="small" data-i18n="plan_premium_desc">Full library access + future add-ons.</p>
      </div>
      <div class="actions">
        <button class="btn btn-success" data-i18n="pay" onclick="ED_PAY.pay('premium','card')">Pay</button>
        <span class="tooltip">
          <button class="btn btn-muted" data-i18n="pay_btc" data-i18n-attr="title:pay_btc" onclick="ED_PAY.pay('premium','btc')">Pay (Bitcoin)</button>
          <span class="tip">Crypto option</span>
        </span>
      </div>
    </article>
  </div>
  <p class="notice" id="legal" data-i18n="legal_disclaimer">Educational content only. Not financial, legal, or tax advice.</p>
</section>

  </main>  <footer class="footer">
    <div class="container">
      <div class="grid-2">
        <div class="small">© <span id="yr"></span> Edunancial, Inc. — West Palm Beach, Florida</div>
        <div class="small" style="text-align:right">
          <a href="/privacy.html" data-i18n="nav_privacy">Privacy</a> •
          <a href="/terms.html" data-i18n="nav_terms">Terms</a>
        </div>
      </div>
    </div>
  </footer>  <script>document.getElementById('yr').textContent = new Date().getFullYear();</script>  <script src="/assets/js/i18n.js" defer></script>  <script src="/assets/js/payments.js" defer></script>  <script>
    // Region name display without the word “Region”
    (function(){
      const u=new URL(window.location.href);
      const r=(u.searchParams.get('r')||localStorage.getItem('ed_region')||'us').toLowerCase();
      const names={us:'region_us',pr:'region_pr',dr:'region_dr'};
      const key=names[r]||names['us'];
      const el=document.getElementById('regionName');
      function getDict(){ return (window.ED_LANG && ED_LANG.get && ED_LANG.get()==='es')? 'es':'en'; }
      // Update on language changes
      const render=()=>{
        const dict = {
          en:{region_us:'United States',region_pr:'Puerto Rico',region_dr:'Dominican Republic'},
          es:{region_us:'Estados Unidos',region_pr:'Puerto Rico',region_dr:'República Dominicana'}
        };
        el.textContent = dict[getDict()][key];
      };
      render();
      window.addEventListener('click', (e)=>{
        if(e.target && e.target.getAttribute && e.target.getAttribute('data-lang-btn')) setTimeout(render, 0);
      });
    })();
  </script></body>
</html><!-- =============================================
FILE: /pricing.html
Purpose: Dedicated pricing page with the same buttons. Keeps language & mode consistent.
============================================== --><!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Edunancial — Pricing</title>
  <link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body>
  <header class="header">
    <div class="container nav">
      <div class="brand">
        <div class="logo"></div>
        <span>Edunancial</span>
        <span class="badge region-chip"><span class="region-label" data-i18n="region_word_hidden"></span><span id="regionNameP" class="small"></span></span>
      </div>
      <nav class="navlinks">
        <a href="/index.html" data-i18n="nav_home">Home</a>
        <a href="/pricing.html" data-i18n="nav_pricing">Pricing</a>
        <a href="/about.html" data-i18n="nav_about">About</a>
        <a href="/terms.html" data-i18n="nav_terms">Terms</a>
        <a href="/privacy.html" data-i18n="nav_privacy">Privacy</a>
        <div class="lang-toggle" role="group" aria-label="Language">
          <button data-lang-btn="en" onclick="ED_LANG.set('en')">EN</button>
          <button data-lang-btn="es" onclick="ED_LANG.set('es')">ES</button>
        </div>
      </nav>
    </div>
  </header>  <main class="container">
    <section class="hero">
      <h1 data-i18n="plans_header">Memberships</h1>
      <p class="small">EN/ES pricing shown below. Buttons are labeled “Pay/Pagar”.</p>
    </section><div class="cards">
  <article class="card plan">
    <div>
      <div class="small" data-i18n="plan_basic_name">Basic</div>
      <div class="price">$5 <span class="small" data-i18n="price_month">/month</span></div>
      <p class="small" data-i18n="plan_basic_desc">Starter access to downloads and updates.</p>
    </div>
    <div class="actions">
      <button class="btn btn-primary" data-i18n="pay" onclick="ED_PAY.pay('basic','card')">Pay</button>
      <button class="btn btn-muted" data-i18n="pay_btc" onclick="ED_PAY.pay('basic','btc')">Pay (Bitcoin)</button>
    </div>
  </article>
  <article class="card plan">
    <div>
      <div class="small" data-i18n="plan_premium_name">Premium</div>
      <div class="price">$15 <span class="small" data-i18n="price_month">/month</span></div>
      <p class="small" data-i18n="plan_premium_desc">Full library access + future add-ons.</p>
    </div>
    <div class="actions">
      <button class="btn btn-success" data-i18n="pay" onclick="ED_PAY.pay('premium','card')">Pay</button>
      <button class="btn btn-muted" data-i18n="pay_btc" onclick="ED_PAY.pay('premium','btc')">Pay (Bitcoin)</button>
    </div>
  </article>
</div>

<div class="hr"></div>

<table class="table small">
  <thead>
    <tr><th>Feature</th><th>Basic</th><th>Premium</th></tr>
  </thead>
  <tbody>
    <tr><td>Downloads</td><td>✔︎</td><td>✔︎</td></tr>
    <tr><td>All Books (EN/ES)</td><td>—</td><td>✔︎</td></tr>
    <tr><td>Future Add‑ons</td><td>—</td><td>✔︎</td></tr>
  </tbody>
</table>

  </main>  <footer class="footer">
    <div class="container small">
      © <span id="yrP"></span> Edunancial, Inc. — West Palm Beach, Florida
    </div>
  </footer>  <script>document.getElementById('yrP').textContent = new Date().getFullYear();</script>  <script src="/assets/js/i18n.js" defer></script>  <script src="/assets/js/payments.js" defer></script>  <script>
    (function(){
      const u=new URL(window.location.href);const r=(u.searchParams.get('r')||localStorage.getItem('ed_region')||'us').toLowerCase();
      const names={us:'United States',pr:'Puerto Rico',dr:'Dominican Republic'};
      const namesEs={us:'Estados Unidos',pr:'Puerto Rico',dr:'República Dominicana'};
      const el=document.getElementById('regionNameP');
      const render=()=>{ const es=(window.ED_LANG && ED_LANG.get && ED_LANG.get()==='es'); el.textContent = (es?namesEs:names)[r]; };
      render();
      window.addEventListener('click', (e)=>{ if(e.target && e.target.getAttribute && e.target.getAttribute('data-lang-btn')) setTimeout(render,0); });
    })();
  </script></body>
</html><!-- =============================================
FILE: /about.html
Purpose: About page using the backstory. Simple bilingual placeholders.
============================================== --><!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Edunancial — About</title>
  <link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body>
  <header class="header">
    <div class="container nav">
      <div class="brand"><div class="logo"></div><span>Edunancial</span></div>
      <nav class="navlinks">
        <a href="/index.html" data-i18n="nav_home">Home</a>
        <a href="/pricing.html" data-i18n="nav_pricing">Pricing</a>
        <a href="/about.html" data-i18n="nav_about">About</a>
        <a href="/terms.html" data-i18n="nav_terms">Terms</a>
        <a href="/privacy.html" data-i18n="nav_privacy">Privacy</a>
        <div class="lang-toggle" role="group" aria-label="Language">
          <button data-lang-btn="en" onclick="ED_LANG.set('en')">EN</button>
          <button data-lang-btn="es" onclick="ED_LANG.set('es')">ES</button>
        </div>
      </nav>
    </div>
  </header>  <main class="container">
    <section class="card">
      <h1>Our Story</h1>
      <p>
        Edunancial was inspired by a simple question from a young son: “How do I make money with my head?”
        From that moment, the mission has been clear—create bilingual, practical education that helps families
        build assets step‑by‑step.
      </p>
      <p>
        This site focuses on clear explanations, visual learning, and real‑world examples—so anyone can start.
      </p>
      <p class="small" data-i18n="legal_disclaimer">Educational content only. Not financial, legal, or tax advice.</p>
    </section>
  </main>  <footer class="footer"><div class="container small">© <span id="yrA"></span> Edunancial, Inc.</div></footer>
  <script>document.getElementById('yrA').textContent = new Date().getFullYear();</script>
  <script src="/assets/js/i18n.js" defer></script>
</body>
</html><!-- =============================================
FILE: /terms.html
Purpose: Placeholder Terms link (use your full Terms text later). Jurisdiction limited to
         Palm Beach County, Florida, per prior instruction.
============================================== --><!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Edunancial — Terms</title>
  <link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body>
  <header class="header">
    <div class="container nav">
      <div class="brand"><div class="logo"></div><span>Edunancial</span></div>
      <nav class="navlinks">
        <a href="/index.html" data-i18n="nav_home">Home</a>
        <a href="/pricing.html" data-i18n="nav_pricing">Pricing</a>
        <a href="/about.html" data-i18n="nav_about">About</a>
        <a href="/terms.html" data-i18n="nav_terms">Terms</a>
        <a href="/privacy.html" data-i18n="nav_privacy">Privacy</a>
        <div class="lang-toggle" role="group" aria-label="Language">
          <button data-lang-btn="en" onclick="ED_LANG.set('en')">EN</button>
          <button data-lang-btn="es" onclick="ED_LANG.set('es')">ES</button>
        </div>
      </nav>
    </div>
  </header>  <main class="container">
    <article class="card">
      <h1>Terms of Use</h1>
      <p class="small">Jurisdiction/Venue: Superior Court in Palm Beach County, Florida.</p>
      <p>Insert full Terms here (EN/ES). Keep “no provider names” in UI intact.</p>
    </article>
  </main>  <footer class="footer"><div class="container small">© <span id="yrT"></span> Edunancial, Inc.</div></footer>
  <script>document.getElementById('yrT').textContent = new Date().getFullYear();</script>
  <script src="/assets/js/i18n.js" defer></script>
</body>
</html><!-- =============================================
FILE: /privacy.html
Purpose: Placeholder Privacy page (EN/ES). Add your full text later.
============================================== --><!doctype html>

<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Edunancial — Privacy</title>
  <link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body>
  <header class="header">
    <div class="container nav">
      <div class="brand"><div class="logo"></div><span>Edunancial</span></div>
      <nav class="navlinks">
        <a href="/index.html" data-i18n="nav_home">Home</a>
        <a href="/pricing.html" data-i18n="nav_pricing">Pricing</a>
        <a href="/about.html" data-i18n="nav_about">About</a>
        <a href="/terms.html" data-i18n="nav_terms">Terms</a>
        <a href="/privacy.html" data-i18n="nav_privacy">Privacy</a>
        <div class="lang-toggle" role="group" aria-label="Language">
          <button data-lang-btn="en" onclick="ED_LANG.set('en')">EN</button>
          <button data-lang-btn="es" onclick="ED_LANG.set('es')">ES</button>
        </div>
      </nav>
    </div>
  </header>  <main class="container">
    <article class="card">
      <h1>Privacy Notice</h1>
      <p>Insert your full Privacy & Cookie text here (EN/ES). Keep billing buttons provider-agnostic.</p>
    </article>
  </main>  <footer class="footer"><div class="container small">© <span id="yrP2"></span> Edunancial, Inc.</div></footer>
  <script>document.getElementById('yrP2').textContent = new Date().getFullYear();</script>
  <script src="/assets/js/i18n.js" defer></script>
</body>
</html><!-- =============================================
FILE: /_headers (Netlify)
Purpose: Security headers without breaking hosted checkout redirects.
Adjust the connect-src/frame-src if you later embed SDKs.
============================================== -->/* Strict-Transport-Security: max-age=31536000; includeSubDomains; preload X-Content-Type-Options: nosniff X-Frame-Options: DENY Referrer-Policy: strict-origin-when-cross-origin Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(self) Content-Security-Policy: default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'; frame-ancestors 'none'; */

Allow redirecting users out to hosted checkouts

/* Access-Control-Allow-Origin: * */

<!-- =============================================
FILE: README_TODO.md
Purpose: Quick checklist to go live.
============================================== -->Edunancial — Payments (EN/ES) Starter

Do these steps in order:

1. Paste your checkout links in /assets/js/payments.js:

Replace US_BASIC_LIVE, US_BASIC_TEST, etc., for US / PR / DR and basic/premium.

Paste your crypto checkout links for basic/premium.



2. Choose mode during testing:

Add ?mode=sandbox to your page URL to show the TEST MODE banner and route to sandbox links.

Remove mode or set ?mode=live when you are ready.



3. Language routing works site‑wide:

Use ?lang=es or ?lang=en. The toggle sets it and persists.

Links auto-carry both lang, mode, and r (region) across pages.



4. Region (no label shown):

Optional: add ?r=us, ?r=pr, or ?r=dr. The small chip updates without showing the word “Region”.



5. Security:

Deploy _headers so HTTPS + security headers are enforced.

If you later embed an SDK, update CSP hosts accordingly.



6. Button labels remain provider‑agnostic:

Keep “Pay/Pagar” text. Do not display provider names in the UI.



7. Going live:

When Square verifies your bank, flip to ?mode=live (or remove the param). No code changes needed.




