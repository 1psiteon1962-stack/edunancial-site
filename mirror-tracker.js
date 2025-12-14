/* =========================================================
   INTERNAL TRACKING — NO UI / NO COOKIES
   ========================================================= */

(function () {
  if (!window.EDUNANCIAL_SITE) return;

  const payload = {
    site_id: window.EDUNANCIAL_SITE.site_id,
    region: window.EDUNANCIAL_SITE.region,
    language: window.EDUNANCIAL_SITE.language,
    role: window.EDUNANCIAL_SITE.role,
    path: window.location.pathname,
    referrer: document.referrer || "direct",
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent
  };

  fetch("/.netlify/functions/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});
})();
