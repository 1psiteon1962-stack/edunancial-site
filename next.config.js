/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // REQUIRED for Netlify + Next 14
  output: "standalone",

  // Disable image optimization for Netlify edge
  images: {
    unoptimized: true
  }
};

export default nextConfig;
