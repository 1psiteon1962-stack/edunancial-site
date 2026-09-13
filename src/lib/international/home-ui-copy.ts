import { normalizeLanguageCode } from "./languages";

export type HomeUiCopy = {
  features: readonly [string, string][];
  goalsTitle: string;
  goalsBody: string;
  goals: Record<"business" | "realEstate" | "retirement" | "finances" | "career" | "family", readonly [string, string]>;
};

const en: HomeUiCopy = {
  features: [["Real-world learning", "Practical financial decisions"], ["Learn at your pace", "Touch, choose, continue"], ["Global perspective", "Built for local context"], ["Clear pathway", "Literacy to intelligence"]],
  goalsTitle: "What challenge are you facing?",
  goalsBody: "Start with what is blocking you. Edunancial will help you find the knowledge and path to move forward.",
  goals: {
    business: ["I want to start a business, but I don't know where to begin", "Learn how ownership, structure, customers, cash flow, and growth fit together."],
    realEstate: ["I want to invest in real estate, but I don't understand the numbers", "Learn how property, financing, risk, and returns work together."],
    retirement: ["I'm worried I'm not financially prepared for retirement", "Build the knowledge to evaluate saving, investing, income, and long-term risk."],
    finances: ["I need to get control of my finances", "Strengthen the fundamentals behind better everyday financial decisions."],
    career: ["I feel financially stuck in my career", "Build financial and business skills that support stronger professional decisions."],
    family: ["I want to help my family make better financial decisions", "Develop knowledge you can use to make more informed family financial decisions."],
  },
};

const es: HomeUiCopy = {
  features: [["Aprendizaje del mundo real", "Decisiones financieras prácticas"], ["Aprende a tu ritmo", "Toca, elige y continúa"], ["Perspectiva global", "Adaptado al contexto local"], ["Ruta clara", "De alfabetización a inteligencia"]],
  goalsTitle: "¿Qué desafío estás enfrentando?",
  goalsBody: "Empieza con lo que te está frenando. Edunancial te ayuda a encontrar el conocimiento y la ruta para avanzar.",
  goals: {
    business: ["Quiero iniciar un negocio, pero no sé por dónde empezar", "Comprende cómo se conectan propiedad, estructura, clientes, flujo de efectivo y crecimiento."],
    realEstate: ["Quiero invertir en bienes raíces, pero no entiendo los números", "Aprende cómo se relacionan propiedad, financiamiento, riesgo y rendimiento."],
    retirement: ["Me preocupa no estar preparado financieramente para el retiro", "Desarrolla conocimientos para evaluar ahorro, inversión, ingresos y riesgo a largo plazo."],
    finances: ["Necesito tomar control de mis finanzas", "Fortalece los fundamentos para tomar mejores decisiones financieras cotidianas."],
    career: ["Me siento estancado financieramente en mi carrera", "Desarrolla habilidades financieras y empresariales para mejores decisiones profesionales."],
    family: ["Quiero ayudar a mi familia a tomar mejores decisiones financieras", "Desarrolla conocimientos para tomar decisiones financieras familiares más informadas."],
  },
};

const fr: HomeUiCopy = {
  features: [["Apprentissage concret", "Décisions financières pratiques"], ["À votre rythme", "Touchez, choisissez, continuez"], ["Perspective mondiale", "Adaptée au contexte local"], ["Parcours clair", "De la littératie à l’intelligence"]],
  goalsTitle: "Quel défi rencontrez-vous ?",
  goalsBody: "Commencez par ce qui vous bloque. Edunancial vous aide à trouver les connaissances et le parcours pour avancer.",
  goals: {
    business: ["Je veux créer une entreprise, mais je ne sais pas par où commencer", "Comprenez comment propriété, structure, clients, trésorerie et croissance s’articulent."],
    realEstate: ["Je veux investir dans l’immobilier, mais je ne comprends pas les chiffres", "Comprenez comment propriété, financement, risque et rendement s’articulent."],
    retirement: ["Je crains de ne pas être financièrement prêt pour la retraite", "Développez les connaissances pour évaluer épargne, investissement, revenu et risque à long terme."],
    finances: ["Je dois reprendre le contrôle de mes finances", "Renforcez les bases de meilleures décisions financières quotidiennes."],
    career: ["Je me sens financièrement bloqué dans ma carrière", "Développez des compétences financières et commerciales utiles à votre carrière."],
    family: ["Je veux aider ma famille à prendre de meilleures décisions financières", "Développez les connaissances nécessaires à des décisions familiales plus éclairées."],
  },
};

const pt: HomeUiCopy = {
  features: [["Aprendizagem prática", "Decisões financeiras reais"], ["Ao seu ritmo", "Toque, escolha e continue"], ["Perspetiva global", "Adaptada ao contexto local"], ["Percurso claro", "Da literacia à inteligência"]],
  goalsTitle: "Que desafio está a enfrentar?",
  goalsBody: "Comece pelo que o está a impedir de avançar. A Edunancial ajuda a encontrar o conhecimento e o percurso certos.",
  goals: {
    business: ["Quero criar um negócio, mas não sei por onde começar", "Compreenda como propriedade, estrutura, clientes, fluxo de caixa e crescimento se relacionam."],
    realEstate: ["Quero investir em imóveis, mas não entendo os números", "Aprenda como propriedade, financiamento, risco e retorno se relacionam."],
    retirement: ["Preocupa-me não estar financeiramente preparado para a reforma", "Desenvolva conhecimento sobre poupança, investimento, rendimento e risco de longo prazo."],
    finances: ["Preciso de assumir o controlo das minhas finanças", "Reforce os fundamentos para melhores decisões financeiras diárias."],
    career: ["Sinto-me financeiramente bloqueado na minha carreira", "Desenvolva competências financeiras e empresariais para melhores decisões profissionais."],
    family: ["Quero ajudar a minha família a tomar melhores decisões financeiras", "Desenvolva conhecimento para decisões financeiras familiares mais informadas."],
  },
};

const de: HomeUiCopy = {
  features: [["Praxisnah lernen", "Praktische Finanzentscheidungen"], ["Im eigenen Tempo", "Tippen, wählen, weitermachen"], ["Globale Perspektive", "Für lokalen Kontext"], ["Klarer Lernweg", "Von Bildung zu Finanzintelligenz"]],
  goalsTitle: "Vor welcher Herausforderung stehen Sie?",
  goalsBody: "Beginnen Sie mit dem, was Sie zurückhält. Edunancial hilft Ihnen, das passende Wissen und den richtigen Weg zu finden.",
  goals: { business: ["Ich möchte ein Unternehmen gründen, weiß aber nicht, wo ich anfangen soll", "Verstehen Sie Eigentum, Struktur, Kunden, Cashflow und Wachstum."], realEstate: ["Ich möchte in Immobilien investieren, verstehe aber die Zahlen nicht", "Lernen Sie das Zusammenspiel von Immobilie, Finanzierung, Risiko und Rendite."], retirement: ["Ich fürchte, finanziell nicht auf den Ruhestand vorbereitet zu sein", "Bewerten Sie Sparen, Investieren, Einkommen und langfristige Risiken besser."], finances: ["Ich muss meine Finanzen in den Griff bekommen", "Stärken Sie die Grundlagen für bessere tägliche Finanzentscheidungen."], career: ["Ich fühle mich finanziell in meiner Karriere festgefahren", "Bauen Sie Finanz- und Geschäftskompetenzen für berufliche Entscheidungen auf."], family: ["Ich möchte meiner Familie helfen, bessere Finanzentscheidungen zu treffen", "Treffen Sie fundiertere finanzielle Entscheidungen für Ihre Familie."] },
};

const it: HomeUiCopy = {
  features: [["Apprendimento reale", "Decisioni finanziarie pratiche"], ["Al tuo ritmo", "Tocca, scegli, continua"], ["Prospettiva globale", "Adattata al contesto locale"], ["Percorso chiaro", "Dall’alfabetizzazione all’intelligenza"]],
  goalsTitle: "Quale sfida stai affrontando?",
  goalsBody: "Parti da ciò che ti sta bloccando. Edunancial ti aiuta a trovare le conoscenze e il percorso per andare avanti.",
  goals: { business: ["Voglio avviare un’impresa, ma non so da dove cominciare", "Comprendi proprietà, struttura, clienti, flusso di cassa e crescita."], realEstate: ["Voglio investire in immobili, ma non capisco i numeri", "Impara come proprietà, finanziamento, rischio e rendimento interagiscono."], retirement: ["Temo di non essere finanziariamente pronto per la pensione", "Valuta meglio risparmio, investimento, reddito e rischio a lungo termine."], finances: ["Devo riprendere il controllo delle mie finanze", "Rafforza le basi per migliori decisioni finanziarie quotidiane."], career: ["Mi sento finanziariamente bloccato nella mia carriera", "Sviluppa competenze finanziarie e aziendali per decisioni professionali migliori."], family: ["Voglio aiutare la mia famiglia a prendere decisioni finanziarie migliori", "Sviluppa conoscenze per decisioni finanziarie familiari più informate."] },
};

const nl: HomeUiCopy = {
  features: [["Leren uit de praktijk", "Praktische financiële beslissingen"], ["In uw eigen tempo", "Tik, kies en ga verder"], ["Wereldwijd perspectief", "Gebouwd voor lokale context"], ["Duidelijk leerpad", "Van geletterdheid naar intelligentie"]],
  goalsTitle: "Voor welke uitdaging staat u?",
  goalsBody: "Begin met wat u tegenhoudt. Edunancial helpt u de kennis en het pad te vinden om verder te komen.",
  goals: { business: ["Ik wil een bedrijf starten, maar weet niet waar ik moet beginnen", "Begrijp eigendom, structuur, klanten, cashflow en groei."], realEstate: ["Ik wil in vastgoed investeren, maar begrijp de cijfers niet", "Leer hoe vastgoed, financiering, risico en rendement samenhangen."], retirement: ["Ik ben bang dat ik financieel niet klaar ben voor mijn pensioen", "Bouw kennis op over sparen, beleggen, inkomen en langetermijnrisico."], finances: ["Ik moet mijn financiën onder controle krijgen", "Versterk de basis voor betere dagelijkse financiële beslissingen."], career: ["Ik voel me financieel vastgelopen in mijn carrière", "Bouw financiële en zakelijke vaardigheden op voor betere professionele beslissingen."], family: ["Ik wil mijn familie helpen betere financiële beslissingen te nemen", "Ontwikkel kennis voor beter geïnformeerde financiële gezinsbeslissingen."] },
};

const catalogs: Record<string, HomeUiCopy> = { en, es, fr, pt, de, it, nl };

export function getHomeUiCopy(language: string): HomeUiCopy {
  const normalized = normalizeLanguageCode(language);
  const base = normalized.split("-")[0]?.toLowerCase() ?? "en";
  return catalogs[base] ?? en;
}
