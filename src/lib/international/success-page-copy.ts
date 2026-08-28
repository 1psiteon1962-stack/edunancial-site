import { normalizeLanguageCode } from "./languages";

export type SuccessPageCopy = {
  successStoriesHeading: string;
  memberTypesAriaLabel: string;
  memberTypes: string[];
  studentSuccessHeading: string;
};

const copies: Record<string, SuccessPageCopy> = {
  en: {
    successStoriesHeading: "Real People. Real Progress.",
    memberTypesAriaLabel: "Member types",
    memberTypes: ["Students", "Families", "Entrepreneurs", "Veterans", "Professionals", "Small Business Owners", "Young Investors", "Community Leaders"],
    studentSuccessHeading: "Student Success",
  },
  es: {
    successStoriesHeading: "Personas reales. Progreso real.",
    memberTypesAriaLabel: "Tipos de miembros",
    memberTypes: ["Estudiantes", "Familias", "Emprendedores", "Veteranos", "Profesionales", "Dueños de pequeñas empresas", "Jóvenes inversionistas", "Líderes comunitarios"],
    studentSuccessHeading: "Éxito estudiantil",
  },
  fr: {
    successStoriesHeading: "De vraies personnes. De vrais progrès.",
    memberTypesAriaLabel: "Types de membres",
    memberTypes: ["Étudiants", "Familles", "Entrepreneurs", "Anciens combattants", "Professionnels", "Propriétaires de petites entreprises", "Jeunes investisseurs", "Leaders communautaires"],
    studentSuccessHeading: "Réussite des étudiants",
  },
  pt: {
    successStoriesHeading: "Pessoas reais. Progresso real.",
    memberTypesAriaLabel: "Tipos de membros",
    memberTypes: ["Estudantes", "Famílias", "Empreendedores", "Veteranos", "Profissionais", "Proprietários de pequenas empresas", "Jovens investidores", "Líderes comunitários"],
    studentSuccessHeading: "Sucesso dos estudantes",
  },
  de: {
    successStoriesHeading: "Echte Menschen. Echter Fortschritt.",
    memberTypesAriaLabel: "Mitgliedsgruppen",
    memberTypes: ["Studierende", "Familien", "Unternehmer", "Veteranen", "Fachkräfte", "Kleinunternehmer", "Junge Investoren", "Führungskräfte in Gemeinden"],
    studentSuccessHeading: "Erfolg der Lernenden",
  },
  it: {
    successStoriesHeading: "Persone reali. Progressi reali.",
    memberTypesAriaLabel: "Tipi di membri",
    memberTypes: ["Studenti", "Famiglie", "Imprenditori", "Veterani", "Professionisti", "Titolari di piccole imprese", "Giovani investitori", "Leader della comunità"],
    studentSuccessHeading: "Successo degli studenti",
  },
  nl: {
    successStoriesHeading: "Echte mensen. Echte vooruitgang.",
    memberTypesAriaLabel: "Soorten leden",
    memberTypes: ["Studenten", "Gezinnen", "Ondernemers", "Veteranen", "Professionals", "Eigenaren van kleine bedrijven", "Jonge beleggers", "Gemeenschapsleiders"],
    studentSuccessHeading: "Succes van studenten",
  },
};

export function getSuccessPageCopy(languageCode: string): SuccessPageCopy {
  const locale = normalizeLanguageCode(languageCode);
  if (locale.startsWith("es")) return copies.es;
  if (locale.startsWith("fr")) return copies.fr;
  if (locale.startsWith("pt")) return copies.pt;
  if (locale === "de") return copies.de;
  if (locale === "it") return copies.it;
  if (locale === "nl") return copies.nl;
  return copies.en;
}
