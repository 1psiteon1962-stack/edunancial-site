/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * 🚨 CRITICAL: REMOVE STATIC EXPORT MODE
   * This fixes the Netlify prerender crash
   */
  // output: 'export', ❌ DO NOT ADD THIS BACK

  /**
   * ✅ Ensure proper Next.js runtime on Netlify
   */
  output: "standalone",

  /**
   * ✅ Prevent image build issues
   */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
