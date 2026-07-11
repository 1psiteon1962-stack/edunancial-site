const DEFAULT_CONNECT_SOURCES = [
  "'self'",
  "https://api.netlify.com",
];

const DEFAULT_FONT_SOURCES = [
  "'self'",
  "https://fonts.gstatic.com",
];

const DEFAULT_FRAME_SOURCES = [
  "'self'",
];

const DEFAULT_IMAGE_SOURCES = [
  "'self'",
  "data:",
  "blob:",
  "https:",
];

const DEFAULT_SCRIPT_SOURCES = [
  "'self'",
  "'unsafe-inline'",
];

const DEFAULT_STYLE_SOURCES = [
  "'self'",
  "'unsafe-inline'",
  "https://fonts.googleapis.com",
];

export function buildContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "connect-src " + DEFAULT_CONNECT_SOURCES.join(" "),
    "font-src " + DEFAULT_FONT_SOURCES.join(" "),
    "form-action 'self'",
    "frame-ancestors 'self'",
    "frame-src " + DEFAULT_FRAME_SOURCES.join(" "),
    "img-src " + DEFAULT_IMAGE_SOURCES.join(" "),
    "object-src 'none'",
    "script-src " + DEFAULT_SCRIPT_SOURCES.join(" "),
    "style-src " + DEFAULT_STYLE_SOURCES.join(" "),
    "upgrade-insecure-requests",
  ].join("; ");
}

export function buildSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy": buildContentSecurityPolicy(),
    "Permissions-Policy":
      "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Strict-Transport-Security":
      "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-DNS-Prefetch-Control": "off",
    "X-Frame-Options": "SAMEORIGIN",
    "X-Permitted-Cross-Domain-Policies": "none",
  };
}
