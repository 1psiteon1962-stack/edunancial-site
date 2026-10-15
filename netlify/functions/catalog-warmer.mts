/**
 * Proactively populate durable public catalog snapshots instead of waiting for
 * the first visitor in each locale. No secrets or authenticated content.
 *
 * Scheduled Netlify functions are invoked by the platform on production
 * deployments. Keep execution bounded: dispatch concurrent GETs without a
 * serial 13-language cold-start chain. Failed locales retry on the next run.
 */
const LANGUAGES = [
  "en-US", "en-GB", "es-419", "es-Caribbean", "es-ES", "fr-CA",
  "fr-FR", "pt-BR", "pt-PT", "de", "it", "nl", "ht",
];
const ORIGIN = "https://edunancial.com";

export default async function handler() {
  const results = await Promise.all(LANGUAGES.map(async (lang) => {
    const url = new URL("/api/public/curriculum/catalog", ORIGIN);
    url.searchParams.set("lang", lang);
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(25_000),
        headers: { "user-agent": "edunancial-catalog-warmer/1" },
        cache: "no-store",
      });
      // Fully read the response to ensure backend work has completed.
      if (response.ok) await response.arrayBuffer();
      return { lang, status: response.status, ok: response.ok };
    } catch (error) {
      return { lang, status: 0, ok: false, detail: String(error) };
    }
  }));
  console.info("[catalog-warmer] snapshot prime results", JSON.stringify(results));
  return new Response(JSON.stringify({
    checked: results.length,
    succeeded: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).map((r) => r.lang),
  }), { headers: { "content-type": "application/json" } });
}

export const config = { schedule: "*/5 * * * *" };
