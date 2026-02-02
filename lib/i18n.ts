export type Locale = "en" | "es";

type Dictionary = Record<string, string>;

const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    doctrine_title: "Doctrine",
    doctrine_body:
      "This is a placeholder doctrine text. Replace keys/values with your real content.",
  },
  es: {
    doctrine_title: "Doctrina",
    doctrine_body:
      "Este es un texto de doctrina de ejemplo. Reemplace claves/valores con su contenido real.",
  },
};

/**
 * Minimal translation helper used across components.
 * - Safe fallback: returns the key if not found.
 * - Normalizes unknown locale to 'en'.
 */
export function t(locale: string, key: string): string {
  const lang: Locale = locale === "es" ? "es" : "en";
  return DICTIONARIES[lang]?.[key] ?? key;
}

/**
 * Optional: expose dictionaries if you need them elsewhere.
 */
export function getDictionary(locale: string): Dictionary {
  const lang: Locale = locale === "es" ? "es" : "en";
  return DICTIONARIES[lang];
}
