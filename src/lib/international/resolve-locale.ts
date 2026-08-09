import {
  DEFAULT_LANGUAGE_CODE,
  LANGUAGE_ALIAS_MAP,
  LANGUAGE_CATALOG,
} from "./languages";

export type ResolveLocaleInput = {
  /** Saved default language from durable storage (localStorage / cookie). */
  savedPreference?: string | null;
  /** Session-only language override from sessionStorage. */
  sessionOverride?: string | null;
  /** Browser navigator.languages array (highest priority browser signal). */
  navigatorLanguages?: string[];
  /** HTTP Accept-Language header value (server-side signal). */
  acceptLanguageHeader?: string | null;
  /** OS-level language hint when available client-side. */
  osLanguage?: string | null;
  /** Geographic locale recommendation (lowest-priority automatic signal). */
  geoLocale?: string | null;
};

/**
 * Parses an HTTP Accept-Language header and returns language tags sorted by
 * quality factor (highest q first).
 */
export function parseAcceptLanguage(header?: string | null): string[] {
  if (!header) return [];
  return header
    .split(",")
    .map((part) => {
      const semicolonIndex = part.indexOf(";q=");
      const tag = (semicolonIndex === -1 ? part : part.slice(0, semicolonIndex)).trim();
      const q = semicolonIndex === -1 ? 1 : Number(part.slice(semicolonIndex + 3).trim());
      return { tag, q: Number.isFinite(q) ? q : 1 };
    })
    .filter((entry) => Boolean(entry.tag))
    .sort((a, b) => b.q - a.q)
    .map((entry) => entry.tag);
}

/**
 * Returns the canonical supported locale code for `value`, or `null` if the
 * value cannot be resolved to any supported locale.
 *
 * Resolution order:
 *   1. Exact code match (case-insensitive)
 *   2. Alias map exact match
 *   3. Alias map base-language match
 *   4. First catalog entry whose base language matches
 */
export function matchSupportedLocale(value?: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();

  // 1. Exact match in catalog
  const exact = LANGUAGE_CATALOG.find((l) => l.code.toLowerCase() === normalized);
  if (exact) return exact.code;

  // 2. Exact alias
  if (LANGUAGE_ALIAS_MAP[normalized]) return LANGUAGE_ALIAS_MAP[normalized];

  // 3. Base language alias
  const base = normalized.split("-")[0];
  if (LANGUAGE_ALIAS_MAP[base]) return LANGUAGE_ALIAS_MAP[base];

  // 4. First catalog entry whose base language matches
  const fromBase = LANGUAGE_CATALOG.find(
    (l) => l.code.toLowerCase().split("-")[0] === base
  );
  if (fromBase) return fromBase.code;

  return null;
}

/**
 * Resolves the active locale following the required priority chain:
 *   1. Current-session language override  (explicit selection)
 *   2. Saved default language  (durable storage / cookie)
 *   3. Automatic browser language detection  (navigator + accept-language + OS)
 *   4. Geographic region detection
 *   5. English (US) fallback
 */
export function resolveLocale(input: ResolveLocaleInput): string {
  // 1. Session language override
  const session = matchSupportedLocale(input.sessionOverride);
  if (session) return session;

  // 2. Saved default language
  const saved = matchSupportedLocale(input.savedPreference);
  if (saved) return saved;

  // 3. Browser language detection (weighted by signal reliability)
  const browserCandidates: string[] = [
    ...(input.navigatorLanguages ?? []),
    ...(input.osLanguage ? [input.osLanguage] : []),
    ...parseAcceptLanguage(input.acceptLanguageHeader),
  ];

  for (const candidate of browserCandidates) {
    const matched = matchSupportedLocale(candidate);
    if (matched) return matched;
  }

  // 4. Geographic region detection
  const geo = matchSupportedLocale(input.geoLocale);
  if (geo) return geo;

  // 5. English (US) fallback
  return DEFAULT_LANGUAGE_CODE;
}
