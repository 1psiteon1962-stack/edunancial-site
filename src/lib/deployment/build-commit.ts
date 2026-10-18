/**
 * Deployed commit identity for runtime code (audits, version endpoint).
 *
 * Netlify exposes COMMIT_REF during the BUILD but not reliably inside deployed
 * server functions, which is why the production audit saw an empty deployCommit.
 * next.config.mjs embeds EDUNANCIAL_BUILD_COMMIT_SHA at build time. Next.js only
 * inlines LITERAL `process.env.NAME` references, so the defaults below must stay
 * written exactly this way (no destructuring, no dynamic keys).
 */
const FULL_SHA = /^[0-9a-f]{40}$/;

export function resolveDeployCommit(
  sources: { embedded?: string; runtime?: string } = {
    embedded: process.env.EDUNANCIAL_BUILD_COMMIT_SHA,
    runtime: process.env.COMMIT_REF,
  },
): string | null {
  // Never invent or guess: only a well-formed full SHA is reported; otherwise null.
  for (const candidate of [sources.embedded, sources.runtime]) {
    const value = candidate?.trim().toLowerCase();
    if (value && FULL_SHA.test(value)) return value;
  }
  return null;
}
