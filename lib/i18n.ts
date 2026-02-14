// lib/i18n.ts

export type Language = 'en' | 'es' | 'pt' | 'fr';

const dictionaries: Record<Language, Record<string, string>> = {
  en: {
    doctrine_title: 'Doctrine',
    doctrine_body: 'Principles, structure, and long-term governance matter more than hustle.'
  },
  es: {
    doctrine_title: 'Doctrina',
    doctrine_body: 'Los principios, la estructura y la gobernanza a largo plazo importan más que el esfuerzo.'
  },
  pt: {
    doctrine_title: 'Doutrina',
    doctrine_body: 'Princípios, estrutura e governança de longo prazo importam mais do que esforço.'
  },
  fr: {
    doctrine_title: 'Doctrine',
    doctrine_body: 'Les principes, la structure et la gouvernance à long terme comptent plus que l’effort.'
  }
};

export function isLanguage(value: string): value is Language {
  return value === 'en' || value === 'es' || value === 'pt' || value === 'fr';
}

export function t(lang: Language, key: string): string {
  return dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key;
}
