/**
 * Standalone Netlify Functions do not run inside the Next.js server.
 * Force production backend selection before storage-dependent modules load.
 */
if (!process.env.NODE_ENV && (process.env.NETLIFY_BLOBS_CONTEXT || process.env.SITE_ID || process.env.AWS_LAMBDA_FUNCTION_NAME)) {
  (process.env as Record<string, string>).NODE_ENV = "production";
}
export const FUNCTION_RUNTIME_NODE_ENV = process.env.NODE_ENV ?? null;
