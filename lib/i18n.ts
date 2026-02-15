export const dictionaries = {
  en: {
    doctrine_title: "Doctrine",
    doctrine_body:
      "Principles, structure, and long-term governance matter more than hustle."
  },
  es: {
    doctrine_title: "Doctrina",
    doctrine_body:
      "Los principios, la estructura y la gobernanza a largo plazo importan más que el esfuerzo."
  },
  fr: {
    doctrine_title: "Doctrine",
    doctrine_body:
      "Les principes, la structure et la gouvernance à long terme comptent plus que l’effort."
  },
  pt: {
    doctrine_title: "Doutrina",
    doctrine_body:
      "Princípios, estrutura e governança de longo prazo importam mais que esforço."
  }
} as const;

export type Language = keyof typeof dictionaries;

export function isLanguage(value: string): value is Language {
  return value in dictionaries;
}

export function t(lang: Language, key: string): string {
  return dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;
}
