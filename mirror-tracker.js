/**
 * mirror-tracker.js
 * Passive detection only (NO redirects yet)
 * Logs visitor context for future routing & analytics
 */

(function () {
  try {
    const config = window.EDU_SITE_CONFIG || {};

    const context = {
      site: config.site || "unknown",
      region: config.region || "unknown",
      language: config.language || navigator.language || "unknown",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    console.log("[Edunancial Mirror Context]", context);

    // Future use:
    // - analytics hook
    // - edge routing
    // - consent-aware logging
    // - A/B mirror testing

    window.EDU_MIRROR_CONTEXT = context;

  } catch (err) {
    console.warn("Mirror tracker error:", err);
  }
})();
