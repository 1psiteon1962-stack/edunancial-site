/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // IMPORTANT:
  // DO NOT use `output: 'export'`
  // App Router + Netlify requires server runtime
};

module.exports = nextConfig;
