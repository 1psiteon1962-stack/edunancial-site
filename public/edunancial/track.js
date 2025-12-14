(function () {
  try {
    const payload = {
      timestamp: new Date().toISOString(),
      hostname: window.location.hostname,
      path: window.location.pathname,
      referrer: document.referrer || "direct",
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
      siteOrigin: document
        .querySelector('meta[name="site-origin"]')
        ?.getAttribute("content") || "unknown",
      edunancialDomain: document
        .querySelector('meta[name="edunancial-domain"]')
        ?.getAttribute("content") || "undefined",
      edunancialIntent: document
        .querySelector('meta[name="edunancial-intent"]')
        ?.getAttribute("content") || "undefined"
    };

    navigator.sendBeacon(
      "/edunancial/collect",
      JSON.stringify(payload)
    );
  } catch (e) {
    // silent by design
  }
})();
