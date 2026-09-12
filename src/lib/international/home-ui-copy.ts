import { normalizeLanguageCode } from "./languages";

export type HomeUiCopy = {
  features: readonly [string, string][];
  goalsTitle: string;
  goalsBody: string;
  goals: Record<"business" | "realEstate" | "retirement" | "finances" | "career" | "family", readonly [string, string]>;
};

const en: HomeUiCopy = {
  features: [["Real-world learning", "Practical financial decisions"], ["Learn at your pace", "Touch, choose, continue"], ["Global perspective", "Built for local context"], ["Clear pathway", "Literacy to intelligence"]],
  goalsTitle: "What are you trying to accomplish?",
  goalsBody: "Start with the problem you want to solve. Edunancial will help you find the relevant path.",
  goals: {
    business: ["Start a Business", "Understand ownership, structure, customers, cash flow, and growth."],
    realEstate: ["Buy or Invest in Real Estate", "Learn how property, financing, risk, and returns work together."],
    retirement: ["Prepare for Retirement", "Build the knowledge to evaluate saving, investing, income, and long-term risk."],
    finances: ["Improve My Finances", "Strengthen the fundamentals behind better everyday financial decisions."],
    career: ["Advance My Career", "Build financial and business skills that support stronger professional decisions."],
    family: ["Help My Family", "Develop knowledge you can use to make more informed family financial decisions."],
  },
};

const es: HomeUiCopy = {
  features: [["Aprendizaje del mundo real", "Decisiones financieras prácticas"], ["Aprende a tu ritmo", "Toca, elige y continúa"], ["Perspectiva global", "Adaptado al contexto local"], ["Ruta clara", "De alfabetización a inteligencia"]],
  goalsTitle: "¿Qué estás tratando de lograr?",
  goalsBody: "Empieza con el problema que quieres resolver. Edunancial te ayuda a encontrar la ruta relevante.",
  goals: {
    business: ["Iniciar un negocio", "Comprende propiedad, estructura, clientes, flujo de efectivo y crecimiento."],
    realEstate: ["Comprar o invertir en bienes raíces", "Aprende cómo se relacionan propiedad, financiamiento, riesgo y rendimiento."],
    retirement: ["Prepararme para el retiro", "Desarrolla conocimientos para evaluar ahorro, inversión, ingresos y riesgo a largo plazo."],
    finances: ["Mejorar mis finanzas", "Fortalece los fundamentos para tomar mejores decisiones financieras cotidianas."],
    career: ["Avanzar en mi carrera", "Desarrolla habilidades financieras y empresariales para mejores decisiones profesionales."],
    family: ["Ayudar a mi familia", "Desarrolla conocimientos para tomar decisiones financieras familiares más informadas."],
  },
};

const fr: HomeUiCopy = {
  features: [["Apprentissage concret", "Décisions financières pratiques"], ["À votre rythme", "Touchez, choisissez, continuez"], ["Perspective mondiale", "Adaptée au contexte local"], ["Parcours clair", "De la littératie à l’intelligence"]],
  goalsTitle: "Qu’essayez-vous d’accomplir ?",
  goalsBody: "Commencez par le problème à résoudre. Edunancial vous aide à trouver le parcours pertinent.",
  goals: {
    business: ["Créer une entreprise", "Comprenez propriété, structure, clients, trésorerie et croissance."],
    realEstate: ["Acheter ou investir dans l’immobilier", "Comprenez comment propriété, financement, risque et rendement s’articulent."],
    retirement: ["Préparer ma retraite", "Développez les connaissances pour évaluer épargne, investissement, revenu et risque à long terme."],
    finances: ["Améliorer mes finances", "Renforcez les bases de meilleures décisions financières quotidiennes."],
    career: ["Faire progresser ma carrière", "Développez des compétences financières et commerciales utiles à votre carrière."],
    family: ["Aider ma famille", "Développez les connaissances nécessaires à des décisions familiales plus éclairées."],
  },
};

const pt: HomeUiCopy = {
  features: [["Aprendizagem prática", "Decisões financeiras reais"], ["Ao seu ritmo", "Toque, escolha e continue"], ["Perspetiva global", "Adaptada ao contexto local"], ["Percurso claro", "Da literacia à inteligência"]],
  goalsTitle: "O que pretende alcançar?",
  goalsBody: "Comece pelo problema que quer resolver. A Edunancial ajuda a encontrar o percurso relevante.",
  goals: {
    business: ["Criar um negócio", "Compreenda propriedade, estrutura, clientes, fluxo de caixa e crescimento."],
    realEstate: ["Comprar ou investir em imóveis", "Aprenda como propriedade, financiamento, risco e retorno se relacionam."],
    retirement: ["Preparar a reforma", "Desenvolva conhecimento sobre poupança, investimento, rendimento e risco de longo prazo."],
    finances: ["Melhorar as minhas finanças", "Reforce os fundamentos para melhores decisões financeiras diárias."],
    career: ["Avançar na carreira", "Desenvolva competências financeiras e empresariais para melhores decisões profissionais."],
    family: ["Ajudar a minha família", "Desenvolva conhecimento para decisões financeiras familiares mais informadas."],
  },
};

const de: HomeUiCopy = {
  features: [["Praxisnah lernen", "Praktische Finanzentscheidungen"], ["Im eigenen Tempo", "Tippen, wählen, weitermachen"], ["Globale Perspektive", "Für lokalen Kontext"], ["Klarer Lernweg", "Von Bildung zu Finanzintelligenz"]],
  goalsTitle: "Was möchten Sie erreichen?",
  goalsBody: "Beginnen Sie mit dem Problem, das Sie lösen möchten. Edunancial hilft Ihnen, den passenden Weg zu finden.",
  goals: { business: ["Ein Unternehmen gründen", "Verstehen Sie Eigentum, Struktur, Kunden, Cashflow und Wachstum."], realEstate: ["Immobilien kaufen oder investieren", "Lernen Sie das Zusammenspiel von Immobilie, Finanzierung, Risiko und Rendite."], retirement: ["Für den Ruhestand vorsorgen", "Bewerten Sie Sparen, Investieren, Einkommen und langfristige Risiken besser."], finances: ["Meine Finanzen verbessern", "Stärken Sie die Grundlagen für bessere tägliche Finanzentscheidungen."], career: ["Meine Karriere voranbringen", "Bauen Sie Finanz- und Geschäftskompetenzen für berufliche Entscheidungen auf."], family: ["Meiner Familie helfen", "Treffen Sie fundiertere finanzielle Entscheidungen für Ihre Familie."] },
};

const it: HomeUiCopy = {
  features: [["Apprendimento reale", "Decisioni finanziarie pratiche"], ["Al tuo ritmo", "Tocca, scegli, continua"], ["Prospettiva globale", "Adattata al contesto locale"], ["Percorso chiaro", "Dall’alfabetizzazione all’intelligenza"]],
  goalsTitle: "Cosa stai cercando di realizzare?",
  goalsBody: "Parti dal problema che vuoi risolvere. Edunancial ti aiuta a trovare il percorso pertinente.",
  goals: { business: ["Avviare un’impresa", "Comprendi proprietà, struttura, clienti, flusso di cassa e crescita."], realEstate: ["Comprare o investire in immobili", "Impara come proprietà, finanziamento, rischio e rendimento interagiscono."], retirement: ["Prepararmi alla pensione", "Valuta meglio risparmio, investimento, reddito e rischio a lungo termine."], finances: ["Migliorare le mie finanze", "Rafforza le basi per migliori decisioni finanziarie quotidiane."], career: ["Far avanzare la mia carriera", "Sviluppa competenze finanziarie e aziendali per decisioni professionali migliori."], family: ["Aiutare la mia famiglia", "Sviluppa conoscenze per decisioni finanziarie familiari più informate."] },
};

const nl: HomeUiCopy = {
  features: [["Leren uit de praktijk", "Praktische financiële beslissingen"], ["In uw eigen tempo", "Tik, kies en ga verder"], ["Wereldwijd perspectief", "Gebouwd voor lokale context"], ["Duidelijk leerpad", "Van geletterdheid naar intelligentie"]],
  goalsTitle: "Wat wilt u bereiken?",
  goalsBody: "Begin met het probleem dat u wilt oplossen. Edunancial helpt u het relevante pad te vinden.",
  goals: { business: ["Een bedrijf starten", "Begrijp eigendom, structuur, klanten, cashflow en groei."], realEstate: ["Vastgoed kopen of erin investeren", "Leer hoe vastgoed, financiering, risico en rendement samenhangen."], retirement: ["Voorbereiden op pensioen", "Bouw kennis op over sparen, beleggen, inkomen en langetermijnrisico."], finances: ["Mijn financiën verbeteren", "Versterk de basis voor betere dagelijkse financiële beslissingen."], career: ["Mijn carrière bevorderen", "Bouw financiële en zakelijke vaardigheden op voor betere professionele beslissingen."], family: ["Mijn familie helpen", "Ontwikkel kennis voor beter geïnformeerde financiële gezinsbeslissingen."] },
};

const catalogs: Record<string, HomeUiCopy> = { en, es, fr, pt, de, it, nl };

export function getHomeUiCopy(language: string): HomeUiCopy {
  const normalized = normalizeLanguageCode(language);
  const base = normalized.split("-")[0]?.toLowerCase() ?? "en";
  return catalogs[base] ?? en;
}
