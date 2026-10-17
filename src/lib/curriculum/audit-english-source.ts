/** English audit completion requires evidence that the learner served English. */
export function isEnglishAuditSource(servedLocale: string | null | undefined): boolean {
  const value = servedLocale?.trim().toLowerCase();
  return value === "en" || value === "en-us";
}
