import localeRegistryJson from "../../../content/registries/locales.json";

export type LocaleDirection = "ltr" | "rtl";
export type LocaleStatus = "active" | "planned" | "disabled";

export interface GlobalLocaleDefinition {
  locale: string;
  language: string;
  script?: string;
  region?: string;
  displayName: string;
  nativeName: string;
  direction: LocaleDirection;
  fallbackChain: string[];
  status: LocaleStatus;
}

interface GlobalLocaleRegistry {
  schemaVersion: string;
  defaultLocale: string;
  locales: GlobalLocaleDefinition[];
}

const registry = localeRegistryJson as GlobalLocaleRegistry;
const localeMap = new Map(registry.locales.map((entry) => [entry.locale.toLowerCase(), entry]));

export function canonicalizeGlobalLocale(input: string | null | undefined): string {
  if (!input?.trim()) return registry.defaultLocale;
  try {
    return Intl.getCanonicalLocales(input.trim().replaceAll("_", "-"))[0] ?? registry.defaultLocale;
  } catch {
    return registry.defaultLocale;
  }
}

export function getGlobalLocale(locale: string): GlobalLocaleDefinition | undefined {
  return localeMap.get(canonicalizeGlobalLocale(locale).toLowerCase());
}

export function getGlobalLocales(options?: { includePlanned?: boolean }): GlobalLocaleDefinition[] {
  return registry.locales.filter((entry) => options?.includePlanned || entry.status === "active");
}

export function getGlobalLocaleFallbackChain(input: string): string[] {
  const requested = canonicalizeGlobalLocale(input);
  const entry = getGlobalLocale(requested);
  const chain = [requested, ...(entry?.fallbackChain ?? [])];
  const base = requested.split("-")[0];
  if (base && !chain.includes(base)) chain.push(base);
  if (!chain.includes(registry.defaultLocale)) chain.push(registry.defaultLocale);
  return [...new Set(chain)];
}

export function isGlobalLocaleRtl(input: string): boolean {
  return getGlobalLocale(input)?.direction === "rtl";
}

export const GLOBAL_DEFAULT_LOCALE = registry.defaultLocale;
