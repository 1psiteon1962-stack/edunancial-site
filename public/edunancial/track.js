(function () {
  try {
    if (!window.EDUNANCIAL_SITE) {
      console.warn("EDUNANCIAL_SITE not defined");
      return;
    }

    const payload = {
      site: window.EDUNANCIAL_SITE.site_id,
      region: window.EDUNANCIAL_SITE.region,
      role: window.EDUNANCIAL_SITE.role,
      language: window.EDUNANCIAL_SITE.language,
      path: window.location.pathname,
      referrer: document.referrer || "",
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };

    navigator.sendBeacon(
      "/.netlify/functions/collect",
      JSON.stringify(payload)
    );
  } catch (e) {
    console.error("EDUNANCIAL TRACK ERROR", e);
  }
})();
