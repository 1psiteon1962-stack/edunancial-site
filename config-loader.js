// /config-loader.js
(function () {
  // Safe defaults so the site still renders even if /api/config fails
  const DEFAULTS = {
    siteName: "Edunancial",
    languageToggle: true,
    payments: { provider: "square", enabled: false },
    ui: { theme: "default", showProducts: true }
  };

  // Make a small helper so other scripts can run AFTER config is ready
  function ready(fn) {
    if (window.EDUNANCIAL_CONFIG_READY) {
      try { fn(window.EDUNANCIAL_CONFIG); } catch (e) { console.error(e); }
    } else {
      document.addEventListener(
        "edunancial:config-ready",
        (e) => { try { fn(e.detail); } catch (err) { console.error(err); } },
        { once: true }
      );
    }
  }

  // Expose helpers
  window.initEdunancial = ready;
  window.EDUNANCIAL_CONFIG = DEFAULTS; // set defaults immediately

  // Try to load live config
  (async () => {
    try {
      const res = await fetch("/api/config", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const cfg = await res.json();
      if (!cfg || typeof cfg !== "object") throw new Error("Empty/invalid JSON");

      // Merge minimal keys onto defaults (so missing keys don't crash UI)
      window.EDUNANCIAL_CONFIG = Object.assign({}, DEFAULTS, cfg);
    } catch (err) {
      console.warn("Config load failed, using defaults.", err);
      // window.EDUNANCIAL_CONFIG already equals DEFAULTS
    } finally {
      window.
