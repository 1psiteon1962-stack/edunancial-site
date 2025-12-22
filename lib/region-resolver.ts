export type Region = "NA" | "EU" | "ASIA";

export function resolveRegion(): Region {
  if (typeof window === "undefined") return "NA";

  const lang = navigator.language.toLowerCase();

  if (lang.startsWith("en-us")) return "NA";
  if (lang.startsWith("en-gb")) return "EU";
  if (lang.startsWith("zh") || lang.startsWith("ja")) return "ASIA";

  return "NA";
}
