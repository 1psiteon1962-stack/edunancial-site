/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ✅ DO NOT use static export on Netlify Next runtime
  // output: "export",

  // keep your app router normal
};

export default nextConfig;
