<script>
// EDUNANCIAL site header with EN/ES toggle (red bar, black letters)
(() => {
  const CONTAINER_ID = "sitebar";

  function ensureContainer() {
    let el = document.getElementById(CONTAINER_ID);
    if (!el) {
      el = document.createElement("div");
      el.id = CONTAINER_ID;
      document.body.prepend(el);
    }
    return el;
  }

  function fileFromPath(p) {
    const last = p.split("/").pop();
    if (!last || last === "") return "index.html";
    return last;
  }

  function buildTargetPath(toEs) {
    const p = window.location.pathname;
    const dir = p.substring(0, p.lastIndexOf("/") + 1);
    const file = fileFromPath(p);
    const isEs = file.startsWith("es-");
    if (toEs) {
      return isEs ? p : dir + "es-" + file;
    } else {
      return isEs ? dir + file.replace(/^es-/, "") : p;
    }
  }

  const wrap = ensureContainer();
  const isSpanish = fileFromPath(location.pathname).startsWith("es-");
  const brandHref = isSpanish ? "/es-index.html" : "/index.html";

  wrap.innerHTML = `
    <div id="edn-sitebar">
      <div class="brand"><a href="${brandHref}">EDUNANCIAL</a></div>
      <div class="lang">
        <a href="#" data-go="en" class="${!isSpanish ? "active" : ""}">EN</a>
        <a href="#" data-go="es" class="${isSpanish ? "active" : ""}">ES</a>
      </div>
    </div>
  `;

  wrap.querySelector('[data-go="es"]').addEventListener("click", (e) => {
    e.preventDefault();
    location.href = buildTargetPath(true);
  });
  wrap.querySelector('[data-go="en"]').addEventListener("click", (e) => {
    e.preventDefault();
    location.href = buildTargetPath(false);
  });

  const css = document.createElement("style");
  css.textContent = `
    #edn-sitebar{position:sticky;top:0;z-index:9999;background:#c00000;color:#000;
      display:flex;justify-content:space-between;align-items:center;
      padding:8px 12px;border-bottom:3px solid #000}
    #edn-sitebar a{color:#000;text-decoration:none}
    #edn-sitebar .brand{font-weight:800;letter-spacing:1px}
    #edn-sitebar .lang a{font-weight:700;border:1px solid #000;
      padding:4px 8px;border-radius:6px;margin-left:6px}
    #edn-sitebar .lang a.active{background:#000;color:#fff}
    @media (max-width:480px){#edn-sitebar .brand{font-size:14px}}
  `;
  document.head.appendChild(css);
})();
</script>
