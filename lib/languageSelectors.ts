export function isLanguageAllowed(
  regionLanguages: readonly string[],
  lang: string
): boolean {
  return regionLanguages.includes(lang);
}
