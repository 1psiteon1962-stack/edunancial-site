<script>
/* Global red header + EN/ES toggle (works on every page that includes this file) */
(function () {
  const pairs = [
    ["index.html","es-index.html"],
    ["books.html","es-books.html"],
    ["courses.html","es-courses.html"],
    ["pricing.html","es-pricing.html"],
    ["checkout.html","es-checkout.html"],
    ["thank-you.html","gracias.html"],
    ["terms.html","es-terms.html"],
    ["refunds.html","es-refunds.html"],
    ["privacy.html","es-privacy.html"]
  ];

  const path = location.pathname.replace(/\/+$/,'');
  const file = path.split('/').pop() || "index.html";
  const find = pairs.find(([en,es]) => en===file || es===file);
  const isES = file.startsWith("es-");
  const enPath = "/" + (find ? find[0] : "index.html");
  const esPath = "/" + (find ? find[1] : "es-index.html");

  const wrap = document.createElement("div");
  wrap.id = "edn-sitebar";
  wrap.innerHTML = `
    <style>
      #edn-sitebar{background:#c30000;color:#000;position:sticky;top:0;z-index:9999;border-bottom:3px solid #000}
      #edn-sitebar .row{max-width:1100px;margin:0 auto;padding:10px 14px;display:flex;align-items:center;gap:12px}
      #edn-sitebar .brand{font-weight:900;letter-spacing:.5px;text-decoration:none;color:#000;background:#ffdfdf;padding:6px 10px;border-radius:6px}
      #edn-sitebar nav{margin-left:auto;display:flex;gap:12px}
      #edn-sitebar nav a{color:#000;text-decoration:none;font-weight:800}
      #edn-sitebar .lang a{display:inline-block;border:2px solid #000;border-radius:10px;padding:5px 10px;text-decoration:none;color:#000;background:#fff;font-weight:800}
      #edn-sitebar .lang .active{background:#000;color:#fff}
      @media (max-width:640px){#edn-sitebar nav{display:none}}
    </style>
    <div class="row">
      <a class="brand" href="/index.html">EDUNANCIAL</a>
      <nav>
        <a href="/index.html">Home</a>
        <a href="/books.html">Books</a>
        <a href="/courses.html">Courses</a>
        <a href="/pricing.html">Pricing</a>
      </nav>
      <div class="lang">
        <a href="${enPath}" class="${!isES?'active':''}">EN</a>
        <a href="${esPath}" class="${isES?'active':''}">ES</a>
      </div>
    </div>
  `;
  document.body.insertBefore(wrap, document.body.firstChild);
})();
</script>
