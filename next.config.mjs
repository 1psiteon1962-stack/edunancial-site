/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ IMPORTANT: REMOVE STATIC EXPORT MODE
  // This allows Netlify to run SSR properly
  output: "standalone",

  experimental: {
    appDir: true,
  },
};

export default nextConfig;
