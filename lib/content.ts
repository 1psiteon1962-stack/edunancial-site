// lib/content.ts

type CopyMap = Record<string, Record<string, string>>;

const COPY: CopyMap = {
  africa: {
    en: "Build discipline first. Then build wealth.",
    fr: "Construisez la discipline d'abord. Puis la richesse.",
  },
  latam: {
    en: "Structure beats shortcuts.",
    es: "La estructura vence a los atajos.",
  },
};

export function resolveCopy(region: string, lang: string): string {
  return (
    COPY[region]?.[lang] ??
    COPY[region]?.en ??
    "Content coming soon."
  );
}
