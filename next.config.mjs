/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * 🚨 FORCE NEXT.JS TO STOP STATIC EXPORT
   */
  output: undefined,

  /**
   * ✅ Required for Netlify compatibility
   */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
