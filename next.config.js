/** @type {import('next').NextConfig} */

const path = require("path");

const nextConfig = {
  reactStrictMode: true,

  // Required for Netlify static export compatibility
  output: "export",

  // Ensures trailing slashes work correctly on Netlify
  trailingSlash: true,

  // Disable Next.js image optimization for static export
  images: {
    unoptimized: true
  },

  // Webpack alias so @/ works in production builds (Netlify)
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },

  // Experimental flags OFF unless explicitly needed
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;
