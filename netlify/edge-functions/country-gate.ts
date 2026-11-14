/**
 * Website access gate. Runs at Netlify's edge before any page, API or cached
 * content is served, and refuses visitors from locations the owner has
 * BLOCKED on /admin/site-access (defaults: U.S. comprehensively sanctioned
 * jurisdictions). Never used for payment authorization.
 */
import { getStore } from "@netlify/blobs";
import type { Config, Context } from "@netlify/edge-functions";

import {
  SITE_ACCESS_KEY,
  SITE_ACCESS_STORE,
  decideSiteAccess,
  parseOverrides,
  type SiteAccessOverrides,
} from "../../src/lib/regions/site-access-policy.ts";

const CACHE_MS = 60_000;
let cached: { at: number; overrides: SiteAccessOverrides } | null = null;

async function loadOverrides(): Promise<SiteAccessOverrides> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.overrides;
  try {
    const raw = await getStore({ name: SITE_ACCESS_STORE, consistency: "eventual" }).get(SITE_ACCESS_KEY, { type: "json" });
    const overrides = parseOverrides(raw);
    cached = { at: Date.now(), overrides };
    return overrides;
  } catch (error) {
    console.error("country-gate: overrides unavailable; using last known or default policy", error);
    // Keep the last known owner decisions; otherwise fall back to the defaults.
    return cached?.overrides ?? {};
  }
}

const BLOCKED_PAGE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Not available</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#08101f;color:#e2e8f0;font-family:system-ui,sans-serif;text-align:center;padding:24px}main{max-width:560px}h1{font-size:28px;margin:0 0 16px}p{line-height:1.6;color:#94a3b8;margin:8px 0}</style></head>
<body><main><h1>Edunancial is not available in your location</h1>
<p>This service is not offered in your country or region.</p>
<p lang="es">Edunancial no está disponible en su ubicación.</p>
<p lang="fr">Edunancial n'est pas disponible dans votre région.</p>
<p lang="pt">O Edunancial não está disponível na sua localização.</p></main></body></html>`;

export default async function countryGate(request: Request, context: Context) {
  const overrides = await loadOverrides();
  const decision = decideSiteAccess(
    { country: context.geo?.country?.code, subdivision: context.geo?.subdivision?.code },
    overrides,
  );
  if (decision.allowed) return context.next();

  console.log(JSON.stringify({ message: "country-gate.blocked", location: decision.location, path: new URL(request.url).pathname }));
  return new Response(BLOCKED_PAGE, {
    status: 451,
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store, private" },
  });
}

export const config: Config = {
  path: "/*",
  excludedPath: ["/_next/static/*", "/favicon.ico", "/robots.txt"],
};
