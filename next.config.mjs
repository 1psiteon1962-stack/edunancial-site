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
  "./content/courses/*/level-1/**/*",
  "./content/courses/*/level-2/**/*",
  "./content/courses/*/level-3/en_us/**/*",
  "./curriculum/seeds/translations/**/*",
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Curriculum is intentionally read from the repository filesystem at runtime.
  // Recursive readdir/readFile calls are invisible to static output tracing. The
  // public curriculum pages and admin/API diagnostics are nested routes, so they
  // need explicit route-glob entries rather than relying on the top-level /* key.
  outputFileTracingIncludes: {
    "/*": curriculumRuntimeFiles,
    "/curriculum/**/*": curriculumRuntimeFiles,
    "/api/**/*": curriculumRuntimeFiles,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/books/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default nextConfig;
