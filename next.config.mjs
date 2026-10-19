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
  "**/api/public/curriculum",
  "**/api/public/curriculum/**",
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

  // Netlify COMMIT_REF exists at build time but may not be exposed to the
  // runtime function. Embed this non-secret deployment identity so the
  // curriculum audit can verify the exact published revision, not guess.
  env: {
    EDUNANCIAL_BUILD_COMMIT_SHA: process.env.COMMIT_REF || process.env.GITHUB_SHA || "",
  },

  // Curriculum is repository-backed and read dynamically. Scope tracing to
  // routes that actually read curriculum data instead of attaching it globally.
  outputFileTracingIncludes: Object.fromEntries(
    curriculumRoutes.map((route) => [route, curriculumRuntimeFiles]),
  ),

  // The Netlify server handler must stay under the AWS Lambda 250 MB (unzipped)
  // limit; at ~284 MB deploys failed with "Invalid AWS Lambda parameters".
  // None of these are read at runtime:
  // - curriculum/reports: generated audit reports (~21 MB); the app only
  //   references them as GitHub repository paths, never from local disk.
  // - typescript: compiler, not needed by the built server (~9 MB).
  // - musl builds of sharp: Lambda runs glibc Linux (~17 MB).
  outputFileTracingExcludes: {
    "*": [
      "./curriculum/reports/**/*",
      "./node_modules/typescript/**/*",
      "./node_modules/@img/sharp-libvips-linuxmusl-x64/**/*",
      "./node_modules/@img/sharp-linuxmusl-x64/**/*",
    ],
  },

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
