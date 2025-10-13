/* header.js — bilingual toggle with safe fallbacks and querystring preservation */
(function () {
  // Map exact counterparts (EN -> ES and ES -> EN)
  const EN_TO_ES = {
    "index.html": "es-our-story.html",
    "memberships-en.html": "memberships-es.html",
    "catalog.html": "es-catalog.html",
    "videos.html": "es-videos.html",
    "contact.html": "es-contact.html",
    "refunds.html": "es-refunds.html",
    "privacy.html": "es-privacy.html",
    "terms-of-service.html": "es-terms-of-service.html",
    "strategy-call.html": "pro-sesion.html",
    "404.html": "404-es.html" // optional Spanish 404 page (if you created it)
  };

  const ES_TO_EN = {
    "es-our-story.html": "index.html",
    "memberships-es.html": "memberships-en.html",
    "es-catalog.html": "catalog.html",
    "es-videos.html": "videos.html",
    "es-contact.html": "contact.html",
    "es-refunds.html": "refunds.html",
    "es-privacy.html": "privacy.html",
    "es-terms-of-service.html": "terms-of-service.html",
    "pro-sesion.html": "strategy-call.html",
    "404-es.html": "404.html" // optional
  };

  function currentFile() {
    const p = location.pathname.split("/").pop();
    return p || "index.html";
  }

  function qs() {
    const q = location.search;
    const h = location.hash;
    return (q || "") + (h || "");
  }

  function safeGo(e, target) {
    e.preventDefault();
    // If the mapped page somehow doesn't exist, fall back to the language home
    const href = "/" + (target || "index.html") + qs();
    location.href = href;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const f = currentFile();
    const enBtn = document.getElementById("langEN");
    const esBtn = document.getElementById("langES");

    if (enBtn) {
      enBtn.addEventListener("click", (e) => {
        const target = ES_TO_EN[f] || "index.html";
        safeGo(e, target);
      });
    }
    if (esBtn) {
      esBtn.addEventListener("click", (e) => {
        const target = EN_TO_ES[f] || "es-our-story.html";
        safeGo(e, target);
      });
    }
  });
})();
