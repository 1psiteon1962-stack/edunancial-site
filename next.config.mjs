/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * 🚨 CRITICAL: DO NOT USE STATIC EXPORT
   */
  // output: 'export',  ❌ REMOVE THIS IF IT EXISTS

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
