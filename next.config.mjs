/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 CRITICAL: DO NOT use static export
  // output: 'export',  ❌ REMOVE THIS IF IT EXISTS

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
