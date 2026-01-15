/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Netlify/OpenNext-safe defaults:
  output: "standalone",

  // If you are using images, this avoids Netlify image optimizer issues.
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
