(function () {
  try {
    if (!window.EDUNANCIAL_SITE) {
      console.warn("EDUNANCIAL_SITE not defined");
      return;
    }

    const endpoint = "/.netlify/functions/collect";
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
    const body = JSON.stringify(payload);

    if (typeof navigator.sendBeacon === "function") {
      const queued = navigator.sendBeacon(endpoint, body);
      if (queued) {
        return;
      }
    }

    if (typeof fetch === "function") {
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true
      }).catch(() => {});
    }
  } catch (e) {
    console.error("EDUNANCIAL TRACK ERROR", e);
  }
})();
