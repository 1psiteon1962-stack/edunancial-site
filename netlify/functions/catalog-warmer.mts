/** Warm public curriculum snapshots without a sequential 13-locale request chain.
 * Read-only: no curriculum or production record writes. */
const LANGUAGES = [
  "en-US", "en-GB", "es-419", "es-Caribbean", "es-ES", "fr-CA",
  "fr-FR", "pt-BR", "pt-PT", "de", "it", "nl", "ht",
];
const ORIGIN = "https://edunancial.com";
const BATCH_SIZE = 3;
const SLOTS = Math.ceil(LANGUAGES.length / BATCH_SIZE);
const MINUTE_MS = 60_000;

export function localesForMinute(ms: number): string[] {
  const slot = ((Math.floor(ms / MINUTE_MS) % SLOTS) + SLOTS) % SLOTS;
  return LANGUAGES.slice(slot * BATCH_SIZE, (slot + 1) * BATCH_SIZE);
}

async function scheduledMinute(request: Request): Promise<number> {
  // Netlify's scheduled payload provides the NEXT invocation time in UTC.
  // The previous minute is this invocation's slot, even when it starts late.
  try {
    const body = await request.json();
    if (typeof body?.next_run === "string") {
      const next = Date.parse(body.next_run);
      if (Number.isFinite(next)) return next - MINUTE_MS;
    }
  } catch { /* local/manual invocation: no scheduled payload */ }
  return Date.now();
}

export default async function handler(request: Request) {
  const batch = localesForMinute(await scheduledMinute(request));
  const results = await Promise.all(batch.map(async (lang) => {
    const url = new URL("/api/public/curriculum/catalog", ORIGIN);
    url.searchParams.set("lang", lang);
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(11_000),
        headers: { "user-agent": "edunancial-catalog-warmer/1" },
        cache: "no-store",
      });
      if (response.ok) await response.arrayBuffer();
      return { lang, status: response.status, ok: response.ok };
    } catch (error) {
      return { lang, status: 0, ok: false, detail: String(error) };
    }
  }));
  console.info("[catalog-warmer] snapshot prime results", JSON.stringify(results));
  return Response.json({
    checked: results.length,
    succeeded: results.filter((result) => result.ok).length,
    failed: results.filter((result) => !result.ok).map((result) => result.lang),
  });
}

export const config = { schedule: "* * * * *" };
