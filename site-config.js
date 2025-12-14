/**
 * site-config.js
 * Central configuration for site identity & mirror behavior
 * This file is intentionally simple and global
 */

window.EDU_SITE_CONFIG = {
  site: "us-main",
  region: "US",
  language: "en",
  role: "primary",
  version: "1.0.0",

  mirrors: {
    us: "https://edunancial.com",
    latam: "https://latam.edunancial.com",
    eu: "https://eu.edunancial.com",
    africa: "https://africa.edunancial.com"
  }
};
