import { Region, Language } from "@/lib/core";

export function resolveCopy(
  region: Region,
  lang: Language
) {
  const content = COPY[region]?.[lang];
  return content ?? null;
}
