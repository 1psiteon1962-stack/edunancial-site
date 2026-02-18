# FILE: next.config.mjs
-const nextConfig = {
-  output: "export",
-  experimental: {
-    // ...whatever you already have here
-  },
-};
-
-export default nextConfig;
+/** @type {import('next').NextConfig} */
+const nextConfig = {
+  reactStrictMode: true,
+
+  // ✅ IMPORTANT:
+  // Do NOT force static export. Netlify's Next.js runtime expects a normal Next build.
+  // Remove any: output: "export"
+
+  // Keep your existing experimental settings if you have them:
+  experimental: {
+    // ...(leave whatever you already had here)
+  },
+};
+
+export default nextConfig;
