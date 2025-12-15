/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // REQUIRED for Netlify
  experimental: {
    appDir: true,
  },

  // DO NOT set output: "standalone"
  // DO NOT use custom server configs
};

module.exports = nextConfig;
