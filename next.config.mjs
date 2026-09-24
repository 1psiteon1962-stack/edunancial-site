/** @type {import('next').NextConfig} */

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), browsing-topics=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
];

const curriculumRuntimeFiles = [
  "./content/courses/**/*",
  "./content/curriculum/**/*",
  "./curriculum/registry.json",
  "./curriculum/seeds/translations/**/*",
  "./content/generated/curriculum-runtime-manifest.json",
];

// Only routes that actually read curriculum from disk get the curriculum files in
// their trace. Attaching all ~4,200 files to every route ("/**") made the
// "Collecting build traces" step exceed the V8 heap limit (exit 134).
// Globs start with "**" so they match with or without the (public) route group.
const curriculumRoutes = [
  "**/courses",
  "**/courses/**",
  "**/curriculum",
  "**/curriculum/**",
  "**/curriculum-diagnostic",
  "**/reconcile-translations",
  "**/progress",
  "**/progress/**",
  "**/investment-growth",
  "**/sitemap*",
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Curriculum is repository-backed and read dynamically. Scope tracing to
  // routes that actually read curriculum data instead of attaching it globally.
  outputFileTracingIncludes: Object.fromEntries(
    curriculumRoutes.map((route) => [route, curriculumRuntimeFiles]),
  ),

  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/_next/static/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/books/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/images/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store, max-age=0" }] },
    ];
  },
};

export default nextConfig;
