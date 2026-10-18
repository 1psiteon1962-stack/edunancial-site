/**
 * Tests the learner resolver's actual served locale for production audit evidence.
 * Canonical English lessons may omit servedLocale, but an explicit non-English
 * return must never count as a successful English learner response.
 *
 * The comparator is passed by the caller to preserve its existing locale-alias
 * equivalence rules for non-English requests.
 */
export function isAuditedServedLocale(
  servedLocale: string | undefined,
  requestedLocale: string,
  sameLocale: (served: string, requested: string) => boolean,
): boolean {
  const isEnglish = (locale: string): boolean =>
    locale.toLowerCase() === "en" || locale.toLowerCase() === "en-us";

  if (isEnglish(requestedLocale)) {
    return !servedLocale || isEnglish(servedLocale);
  }
  return Boolean(servedLocale && servedLocale !== "en" && sameLocale(servedLocale, requestedLocale));
}
