/**
 * Resource budget for authenticated, read-only production curriculum audits.
 *
 * Only explicit, recognized coordinates are accepted. Silently dropping an
 * invalid selector can produce an empty, misleadingly successful audit.
 * The audit CLI already sends exactly one coordinate at a time.
 */
export const MAX_PRODUCTION_AUDIT_COORDINATES = 4;

const TRACKS = new Set([
  "RED", "WHITE", "BLUE", "GREEN", "GOLD", "PURPLE", "ORANGE", "BLACK",
]);

export type AuditRequestSelection = {
  tracks: string[];
  levels: number[];
  locales: string[];
};

function split(value: string | null): string[] {
  return (value ?? "").split(",").map((part) => part.trim()).filter(Boolean);
}

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

/**
 * Fail closed for omissions, unknown values, duplicates and excessive fanout.
 * Locale membership is supplied from the live LANGUAGE_CATALOG, not hardcoded.
 */
export function parseProductionAuditSelection(
  params: URLSearchParams,
  supportedLocales: readonly string[],
): AuditRequestSelection | null {
  const tracks = split(params.get("tracks"));
  const rawLevels = split(params.get("levels"));
  const locales = split(params.get("locales"));
  if (!tracks.length || !rawLevels.length || !locales.length) return null;
  if (!unique(tracks) || !unique(rawLevels) || !unique(locales)) return null;
  if (tracks.some((track) => !TRACKS.has(track))) return null;
  if (rawLevels.some((level) => !/^[1-5]$/.test(level))) return null;
  const allowedLocales = new Set(supportedLocales);
  if (locales.some((locale) => !allowedLocales.has(locale))) return null;
  if (tracks.length * rawLevels.length * locales.length > MAX_PRODUCTION_AUDIT_COORDINATES) return null;
  return { tracks, levels: rawLevels.map(Number), locales };
}
