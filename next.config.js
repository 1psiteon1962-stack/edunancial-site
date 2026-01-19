/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * CRITICAL:
   * This project uses the App Router and dynamic features.
   * Static export MUST NOT be enabled.
   *
   * The following must NOT exist anywhere:
   * - output: 'export'
   * - experimental.outputStandalone
   * - NEXT_PRIVATE_TARGET=export
   */
};

module.exports = nextConfig;
