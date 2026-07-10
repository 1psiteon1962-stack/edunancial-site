export const RTL_LOCALES = ["ar", "he", "fa", "ur"];

export function isRtl(locale: string): boolean {
  return RTL_LOCALES.includes(locale.toLowerCase());
}

export function getHtmlDir(locale: string): "ltr" | "rtl" {
  return isRtl(locale) ? "rtl" : "ltr";
}
