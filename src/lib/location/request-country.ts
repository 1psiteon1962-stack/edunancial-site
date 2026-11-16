export type RequestCountrySource =
  | "netlify-country"
  | "netlify-geo"
  | "vercel"
  | "cloudflare"
  | "cloudfront"
  | "client"
  | "billing-confirmed";

export interface ResolvedRequestCountry {
  countryCode: string;
  source: RequestCountrySource;
  detectedCountryCode: string | null;
  requestedCountryCode: string | null;
  mismatch: boolean;
  /** Present (true) only when the buyer confirmed a billing country that differs from network geography. */
  networkCountryMismatch?: boolean;
}

export interface ResolveRequestCountryOptions {
  /**
   * The buyer explicitly confirmed that the selected country is their billing
   * country (for example a member who is traveling). The confirmed country is
   * then used and the network country is kept only as evidence.
   */
  billingCountryConfirmed?: boolean;
}

function normalizeCountryCode(value: string | null | undefined): string | null {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (!/^[A-Z]{2}$/u.test(normalized)) return null;
  if (normalized === "XX" || normalized === "T1") return null;
  return normalized;
}

function parseNetlifyGeo(value: string | null): string | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as {
      country?: { code?: string } | string;
      countryCode?: string;
      country_code?: string;
    };
    if (typeof parsed.country === "string") return normalizeCountryCode(parsed.country);
    return normalizeCountryCode(parsed.country?.code ?? parsed.countryCode ?? parsed.country_code);
  } catch {
    return null;
  }
}

/**
 * Resolve country only from hosting/CDN headers that are expected to be
 * supplied by the platform rather than from browser language or timezone.
 */
export function detectTrustedRequestCountry(headers: Headers): {
  countryCode: string;
  source: Exclude<RequestCountrySource, "client">;
} | null {
  const candidates: Array<[Exclude<RequestCountrySource, "client">, string | null]> = [
    ["netlify-country", headers.get("x-nf-country")],
    ["netlify-geo", parseNetlifyGeo(headers.get("x-nf-geo"))],
    ["vercel", headers.get("x-vercel-ip-country")],
    ["cloudflare", headers.get("cf-ipcountry")],
    ["cloudfront", headers.get("cloudfront-viewer-country")],
  ];

  for (const [source, raw] of candidates) {
    const countryCode = normalizeCountryCode(raw);
    if (countryCode) return { countryCode, source };
  }
  return null;
}

/**
 * Reconcile trusted network geography with a country sent by the client.
 * Network geography wins when present; a mismatch is surfaced so checkout can
 * refuse stale/spoofed client state instead of silently charging the wrong
 * country configuration. If no trusted geo signal exists, an explicit client
 * country may be used, but we never invent US/CA from item currency. A buyer
 * who explicitly confirms a different billing country (a traveling member)
 * overrides network geography; the network country is retained as evidence.
 */
export function resolveRequestCountry(
  headers: Headers,
  requestedCountryCode?: string | null,
  options: ResolveRequestCountryOptions = {},
): ResolvedRequestCountry | null {
  const detected = detectTrustedRequestCountry(headers);
  const requested = normalizeCountryCode(requestedCountryCode);

  if (detected && requested && requested !== detected.countryCode && options.billingCountryConfirmed === true) {
    return {
      countryCode: requested,
      source: "billing-confirmed",
      detectedCountryCode: detected.countryCode,
      requestedCountryCode: requested,
      mismatch: false,
      networkCountryMismatch: true,
    };
  }

  if (detected) {
    return {
      countryCode: detected.countryCode,
      source: detected.source,
      detectedCountryCode: detected.countryCode,
      requestedCountryCode: requested,
      mismatch: Boolean(requested && requested !== detected.countryCode),
    };
  }

  if (requested) {
    return {
      countryCode: requested,
      source: "client",
      detectedCountryCode: null,
      requestedCountryCode: requested,
      mismatch: false,
    };
  }

  return null;
}
