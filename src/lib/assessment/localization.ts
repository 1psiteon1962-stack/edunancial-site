import type { CompetencyArea } from "@/lib/assessment/scoring";
import { normalizeLanguageCode } from "@/lib/international/languages";

export type AssessmentChoice = "A" | "B" | "C" | "D";
export type LocalizedAssessmentQuestion = {
  id: string;
  area: CompetencyArea;
  text: string;
  options: { value: AssessmentChoice; label: string }[];
};
export type LocalizedAssessmentSection = {
  index: number;
  title: string;
  subtitle: string;
  area: CompetencyArea;
  questions: LocalizedAssessmentQuestion[];
};

type QuestionCopy = [string, string, string, string, string];
type SectionCopy = [string, QuestionCopy, QuestionCopy, QuestionCopy, QuestionCopy];

type ResultsCopy = {
  loading: string;
  startingPoint: string;
  profileTitle: string;
  profileIntro: string;
  samplePrefix: string;
  freeDiagnostic: string;
  sampleSuffix: string;
  startingScore: string;
  currentBenchmark: string;
  strengthsTitle: string;
  strengthsIntro: string;
  opportunitiesTitle: string;
  opportunitiesIntro: string;
  recommendedMove: string;
  startWith: string;
  recommendationIntro: string;
  priority: string;
  startPath: string;
  chessTitle: string;
  chessBody: string;
  startRecommended: string;
  saveProgress: string;
  membershipOptions: string;
  areas: Record<CompetencyArea, string>;
  levels: Record<string, string>;
  recommendations: Record<CompetencyArea, { title: string; desc: string; href: string }[]>;
};

type AssessmentLocaleCopy = {
  wizard: {
    sectionOf: string;
    complete: string;
    question: string;
    previous: string;
    continueToSection: string;
    calculating: string;
    completeAssessment: string;
    answerAll: string;
  };
  sections: LocalizedAssessmentSection[];
  results: ResultsCopy;
};

const AREAS: CompetencyArea[] = [
  "personalFinance",
  "investing",
  "realEstate",
  "business",
  "riskManagement",
  "financialProfile",
];
const IDS = [
  ["pf-1", "pf-2", "pf-3", "pf-4"],
  ["inv-1", "inv-2", "inv-3", "inv-4"],
  ["re-1", "re-2", "re-3", "re-4"],
  ["biz-1", "biz-2", "biz-3", "biz-4"],
  ["rm-1", "rm-2", "rm-3", "rm-4"],
  ["fp-1", "fp-2", "fp-3", "fp-4"],
];

function buildSections(copy: SectionCopy[], sectionWord: string): LocalizedAssessmentSection[] {
  return copy.map((section, sectionIndex) => ({
    index: sectionIndex + 1,
    title: section[0],
    subtitle: `${sectionWord} ${sectionIndex + 1} / 6`,
    area: AREAS[sectionIndex],
    questions: section.slice(1).map((question, questionIndex) => ({
      id: IDS[sectionIndex][questionIndex],
      area: AREAS[sectionIndex],
      text: question[0],
      options: (["A", "B", "C", "D"] as AssessmentChoice[]).map((value, optionIndex) => ({
        value,
        label: question[optionIndex + 1],
      })),
    })),
  }));
}

const EN_SECTIONS: SectionCopy[] = [
  ["Personal Financial Management",
    ["How often do you prepare and follow a written budget?", "Every month", "Most months", "Occasionally", "Never"],
    ["If you lost your primary income today, how long could you cover normal expenses?", "More than one year", "Six to twelve months", "One to six months", "Less than one month"],
    ["Which statement best describes your savings habits?", "I save automatically every payday.", "I save regularly but not consistently.", "I save only when money is left over.", "I rarely save money."],
    ["When making a purchase, what usually influences your decision most?", "My written financial plan and budget.", "I compare value before buying.", "I usually decide based on emotion.", "I buy what I want without much planning."]],
  ["Investing & Paper Assets",
    ["How would you describe your current investment portfolio?", "Diversified across multiple asset classes.", "Mostly in stocks and mutual funds.", "Primarily in savings accounts.", "I don't currently invest."],
    ["How well do you understand the difference between stocks, ETFs, and bonds?", "Very well — I actively manage my portfolio.", "Moderately — I understand the basics.", "Slightly — I've read about them but don't invest.", "Not at all."],
    ["How much do you contribute to a retirement account annually?", "Maximum allowed contribution.", "A consistent, meaningful amount.", "Occasionally or minimally.", "Nothing currently."],
    ["How do you manage investment risk?", "I use a documented risk management strategy.", "I diversify and rebalance periodically.", "I mostly avoid risk by staying in cash.", "I haven't thought much about risk management."]],
  ["Real Estate",
    ["Do you currently own investment real estate?", "Yes — multiple properties generating cash flow.", "Yes — one investment property.", "No, but I'm actively researching.", "No, and I haven't considered it."],
    ["How well do you understand real estate cash flow analysis?", "Very well — I calculate cap rates and NOI.", "Moderately — I understand cash flow basics.", "Slightly — I've heard of these concepts.", "Not at all."],
    ["How familiar are you with creative real estate financing?", "Very — I've used subject-to, owner finance, etc.", "Familiar with concepts but haven't used them.", "I've heard of them but don't understand them well.", "Not familiar at all."],
    ["What is your approach to building real estate wealth?", "Active acquisition with a documented strategy.", "Learning and preparing to acquire.", "Passively interested but no concrete plan.", "Real estate is not part of my financial plan."]],
  ["Business",
    ["Do you own or operate a business?", "Yes — profitable and growing.", "Yes — in early stages or break-even.", "No, but actively planning to start one.", "No business ownership."],
    ["How well do you track your business KPIs?", "Weekly dashboard with key performance metrics.", "Monthly review of major financial metrics.", "Occasional review when problems arise.", "I don't track KPIs."],
    ["How well do you understand your business profit margins?", "Precisely — I optimize margins consistently.", "Moderately — I review them regularly.", "Slightly — I know if I'm profitable or not.", "I'm not sure of my margins."],
    ["What is your current approach to business growth?", "Documented scaling plan with systems and delegation.", "Growing but without a formal plan.", "Focused on survival rather than growth.", "No business to grow currently."]],
  ["Risk Management",
    ["How well protected is your income from disability or illness?", "Fully insured with disability and income protection.", "Partially covered through employer benefits.", "Minimal coverage.", "No income protection insurance."],
    ["How are your personal assets protected legally?", "LLCs, trusts, and legal structures in place.", "Some legal protection in place.", "I'm planning to set up protection.", "No legal asset protection in place."],
    ["How prepared are you financially for a major economic downturn?", "Very prepared — diversified and liquid reserves.", "Somewhat prepared with some reserves.", "Minimally prepared.", "Not prepared at all."],
    ["Do you have an estate plan (will, beneficiaries, POA)?", "Complete and recently updated estate plan.", "Basic documents in place but not comprehensive.", "Started but not completed.", "No estate plan."]],
  ["Financial Profile",
    ["How clearly defined are your long-term financial goals?", "Written, specific goals with timelines and plans.", "General goals I think about regularly.", "Vague ideas about what I want financially.", "I haven't set financial goals."],
    ["How would you describe your financial education?", "Extensive — I continuously study money and investing.", "Good — I've studied several key areas.", "Basic — some general financial literacy.", "Minimal formal financial education."],
    ["How consistent are your financial habits overall?", "Highly disciplined and consistent financial habits.", "Mostly consistent with occasional lapses.", "Inconsistent — I struggle to maintain good habits.", "Poor financial habits I want to change."],
    ["What best describes your financial mentorship or community?", "Active financial mentor and peer learning group.", "Some guidance from books, courses, or advisors.", "Mostly self-directed without much guidance.", "Learning entirely on my own without guidance."]],
];

const IT_SECTIONS: SectionCopy[] = [
  ["Gestione finanziaria personale",
    ["Con quale frequenza prepari e segui un budget scritto?", "Ogni mese", "Quasi ogni mese", "Occasionalmente", "Mai"],
    ["Se oggi perdessi la tua principale fonte di reddito, per quanto tempo potresti coprire le normali spese?", "Più di un anno", "Da sei a dodici mesi", "Da uno a sei mesi", "Meno di un mese"],
    ["Quale frase descrive meglio le tue abitudini di risparmio?", "Risparmio automaticamente a ogni stipendio.", "Risparmio regolarmente, ma non sempre.", "Risparmio solo quando avanza denaro.", "Risparmio raramente."],
    ["Quando fai un acquisto, che cosa influenza maggiormente la tua decisione?", "Il mio piano finanziario scritto e il budget.", "Confronto il valore prima di acquistare.", "Di solito decido in base alle emozioni.", "Compro ciò che voglio con poca pianificazione."]],
  ["Investimenti e attività finanziarie",
    ["Come descriveresti il tuo attuale portafoglio di investimenti?", "Diversificato tra più classi di attività.", "Principalmente azioni e fondi comuni.", "Principalmente conti di risparmio.", "Attualmente non investo."],
    ["Quanto comprendi la differenza tra azioni, ETF e obbligazioni?", "Molto bene — gestisco attivamente il mio portafoglio.", "Abbastanza — comprendo le basi.", "Poco — ne ho letto, ma non investo.", "Per niente."],
    ["Quanto versi ogni anno in un conto pensionistico?", "Il massimo consentito.", "Un importo costante e significativo.", "Occasionalmente o in misura minima.", "Attualmente nulla."],
    ["Come gestisci il rischio degli investimenti?", "Uso una strategia documentata di gestione del rischio.", "Diversifico e riequilibro periodicamente.", "Evito soprattutto il rischio mantenendo liquidità.", "Non ho riflettuto molto sulla gestione del rischio."]],
  ["Immobiliare",
    ["Possiedi attualmente immobili a scopo di investimento?", "Sì — più proprietà che generano flusso di cassa.", "Sì — una proprietà d'investimento.", "No, ma sto facendo ricerche attivamente.", "No, e non l'ho ancora considerato."],
    ["Quanto comprendi l'analisi del flusso di cassa immobiliare?", "Molto bene — calcolo cap rate e NOI.", "Abbastanza — comprendo le basi del flusso di cassa.", "Poco — ho sentito parlare di questi concetti.", "Per niente."],
    ["Quanto conosci le forme creative di finanziamento immobiliare?", "Molto — ho usato subject-to, finanziamento del venditore, ecc.", "Conosco i concetti ma non li ho utilizzati.", "Ne ho sentito parlare ma non li comprendo bene.", "Per niente."],
    ["Qual è il tuo approccio alla costruzione di ricchezza immobiliare?", "Acquisizioni attive con una strategia documentata.", "Sto imparando e mi preparo ad acquistare.", "Sono interessato passivamente, senza un piano concreto.", "L'immobiliare non fa parte del mio piano finanziario."]],
  ["Impresa",
    ["Possiedi o gestisci un'impresa?", "Sì — redditizia e in crescita.", "Sì — nelle fasi iniziali o in pareggio.", "No, ma sto pianificando attivamente di avviarne una.", "Non possiedo un'impresa."],
    ["Quanto bene monitori i KPI della tua impresa?", "Dashboard settimanale con indicatori chiave.", "Revisione mensile dei principali indicatori finanziari.", "Revisione occasionale quando sorgono problemi.", "Non monitoro i KPI."],
    ["Quanto comprendi i margini di profitto della tua impresa?", "Con precisione — ottimizzo costantemente i margini.", "Abbastanza — li controllo regolarmente.", "Poco — so se sono in utile o in perdita.", "Non sono sicuro dei miei margini."],
    ["Qual è il tuo attuale approccio alla crescita dell'impresa?", "Piano documentato di scalabilità con sistemi e delega.", "Sto crescendo, ma senza un piano formale.", "Sono concentrato sulla sopravvivenza più che sulla crescita.", "Attualmente non ho un'impresa da far crescere."]],
  ["Gestione del rischio",
    ["Quanto è protetto il tuo reddito in caso di invalidità o malattia?", "Completamente assicurato con protezione per invalidità e reddito.", "Parzialmente coperto dai benefit del datore di lavoro.", "Copertura minima.", "Nessuna assicurazione di protezione del reddito."],
    ["Come sono protetti legalmente i tuoi beni personali?", "LLC, trust e strutture legali già predisposte.", "Alcune protezioni legali sono già presenti.", "Sto pianificando di predisporre protezioni.", "Nessuna protezione legale dei beni."],
    ["Quanto sei preparato finanziariamente per una grave recessione economica?", "Molto preparato — riserve diversificate e liquide.", "Abbastanza preparato con alcune riserve.", "Preparazione minima.", "Per niente preparato."],
    ["Hai un piano successorio (testamento, beneficiari, procura)?", "Piano completo e aggiornato di recente.", "Documenti di base presenti, ma non completi.", "Iniziato ma non completato.", "Nessun piano successorio."]],
  ["Profilo finanziario",
    ["Quanto sono definiti chiaramente i tuoi obiettivi finanziari di lungo termine?", "Obiettivi scritti e specifici con scadenze e piani.", "Obiettivi generali a cui penso regolarmente.", "Idee vaghe su ciò che desidero finanziariamente.", "Non ho definito obiettivi finanziari."],
    ["Come descriveresti la tua educazione finanziaria?", "Ampia — studio continuamente denaro e investimenti.", "Buona — ho studiato diverse aree importanti.", "Di base — una certa alfabetizzazione finanziaria generale.", "Formazione finanziaria formale minima."],
    ["Quanto sono costanti nel complesso le tue abitudini finanziarie?", "Molto disciplinate e costanti.", "Per lo più costanti, con qualche eccezione.", "Incostanti — faccio fatica a mantenere buone abitudini.", "Cattive abitudini finanziarie che voglio cambiare."],
    ["Che cosa descrive meglio il tuo mentoring o la tua comunità finanziaria?", "Mentore finanziario attivo e gruppo di apprendimento tra pari.", "Una certa guida da libri, corsi o consulenti.", "Principalmente autodidatta, con poca guida.", "Imparo completamente da solo senza guida."]],
];

const ES_SECTIONS: SectionCopy[] = [
  ["Administración financiera personal",
    ["¿Con qué frecuencia preparas y sigues un presupuesto por escrito?", "Todos los meses", "La mayoría de los meses", "Ocasionalmente", "Nunca"],
    ["Si hoy perdieras tu principal fuente de ingresos, ¿por cuánto tiempo podrías cubrir tus gastos normales?", "Más de un año", "De seis a doce meses", "De uno a seis meses", "Menos de un mes"],
    ["¿Qué afirmación describe mejor tus hábitos de ahorro?", "Ahorro automáticamente cada vez que cobro.", "Ahorro regularmente, pero no siempre.", "Ahorro solo cuando sobra dinero.", "Rara vez ahorro dinero."],
    ["Cuando haces una compra, ¿qué suele influir más en tu decisión?", "Mi plan financiero escrito y mi presupuesto.", "Comparo el valor antes de comprar.", "Normalmente decido por emoción.", "Compro lo que quiero sin mucha planificación."]],
  ["Inversiones y activos financieros",
    ["¿Cómo describirías tu cartera actual de inversiones?", "Diversificada entre varias clases de activos.", "Principalmente acciones y fondos mutuos.", "Principalmente cuentas de ahorro.", "Actualmente no invierto."],
    ["¿Qué tan bien entiendes la diferencia entre acciones, ETF y bonos?", "Muy bien — administro activamente mi cartera.", "Moderadamente — entiendo lo básico.", "Un poco — he leído sobre ellos, pero no invierto.", "Nada."],
    ["¿Cuánto aportas anualmente a una cuenta de retiro?", "El máximo permitido.", "Una cantidad constante y significativa.", "Ocasionalmente o muy poco.", "Nada actualmente."],
    ["¿Cómo manejas el riesgo de inversión?", "Uso una estrategia documentada de gestión de riesgo.", "Diversifico y rebalanceo periódicamente.", "Evito gran parte del riesgo manteniéndome en efectivo.", "No he pensado mucho en la gestión de riesgo."]],
  ["Bienes raíces",
    ["¿Actualmente posees bienes raíces de inversión?", "Sí — varias propiedades que generan flujo de efectivo.", "Sí — una propiedad de inversión.", "No, pero estoy investigando activamente.", "No, y no lo he considerado."],
    ["¿Qué tan bien entiendes el análisis de flujo de efectivo inmobiliario?", "Muy bien — calculo tasas de capitalización y NOI.", "Moderadamente — entiendo lo básico del flujo de efectivo.", "Un poco — he escuchado estos conceptos.", "Nada."],
    ["¿Qué tan familiarizado estás con el financiamiento creativo de bienes raíces?", "Mucho — he usado subject-to, financiamiento del dueño, etc.", "Conozco los conceptos, pero no los he usado.", "He oído hablar de ellos, pero no los entiendo bien.", "Nada familiarizado."],
    ["¿Cuál es tu enfoque para crear riqueza con bienes raíces?", "Adquisición activa con una estrategia documentada.", "Aprendiendo y preparándome para adquirir.", "Interés pasivo, pero sin un plan concreto.", "Los bienes raíces no forman parte de mi plan financiero."]],
  ["Negocios",
    ["¿Posees u operas un negocio?", "Sí — rentable y en crecimiento.", "Sí — en etapa inicial o en punto de equilibrio.", "No, pero estoy planificando activamente comenzar uno.", "No poseo un negocio."],
    ["¿Qué tan bien monitoreas los KPI de tu negocio?", "Panel semanal con métricas clave de desempeño.", "Revisión mensual de las principales métricas financieras.", "Revisión ocasional cuando surgen problemas.", "No monitoreo KPI."],
    ["¿Qué tan bien entiendes los márgenes de ganancia de tu negocio?", "Con precisión — optimizo los márgenes constantemente.", "Moderadamente — los reviso regularmente.", "Un poco — sé si tengo ganancias o pérdidas.", "No estoy seguro de mis márgenes."],
    ["¿Cuál es tu enfoque actual para el crecimiento del negocio?", "Plan documentado para escalar con sistemas y delegación.", "Creciendo, pero sin un plan formal.", "Enfocado en sobrevivir más que en crecer.", "Actualmente no tengo un negocio que hacer crecer."]],
  ["Gestión de riesgos",
    ["¿Qué tan protegido está tu ingreso ante una discapacidad o enfermedad?", "Totalmente asegurado con protección por discapacidad e ingresos.", "Parcialmente cubierto por beneficios del empleador.", "Cobertura mínima.", "Sin seguro de protección de ingresos."],
    ["¿Cómo están protegidos legalmente tus activos personales?", "LLC, fideicomisos y estructuras legales establecidas.", "Existe cierta protección legal.", "Estoy planificando establecer protección.", "No tengo protección legal de activos."],
    ["¿Qué tan preparado estás financieramente para una fuerte recesión económica?", "Muy preparado — reservas diversificadas y líquidas.", "Algo preparado con algunas reservas.", "Preparación mínima.", "Nada preparado."],
    ["¿Tienes un plan patrimonial (testamento, beneficiarios, poder)?", "Plan completo y actualizado recientemente.", "Documentos básicos, pero no completos.", "Iniciado pero no completado.", "No tengo plan patrimonial."]],
  ["Perfil financiero",
    ["¿Qué tan claramente definidos están tus objetivos financieros a largo plazo?", "Objetivos escritos y específicos con fechas y planes.", "Objetivos generales en los que pienso regularmente.", "Ideas vagas sobre lo que quiero financieramente.", "No he establecido objetivos financieros."],
    ["¿Cómo describirías tu educación financiera?", "Amplia — estudio continuamente dinero e inversiones.", "Buena — he estudiado varias áreas importantes.", "Básica — cierta alfabetización financiera general.", "Educación financiera formal mínima."],
    ["¿Qué tan constantes son tus hábitos financieros en general?", "Muy disciplinados y constantes.", "Mayormente constantes con algunas fallas ocasionales.", "Inconstantes — me cuesta mantener buenos hábitos.", "Malos hábitos financieros que quiero cambiar."],
    ["¿Qué describe mejor tu mentoría o comunidad financiera?", "Mentor financiero activo y grupo de aprendizaje entre pares.", "Algo de orientación de libros, cursos o asesores.", "Principalmente autodidacta con poca orientación.", "Aprendo completamente por mi cuenta sin orientación."]],
];

const FR_SECTIONS: SectionCopy[] = [
  ["Gestion financière personnelle",
    ["À quelle fréquence préparez-vous et suivez-vous un budget écrit?", "Chaque mois", "La plupart des mois", "À l'occasion", "Jamais"],
    ["Si vous perdiez aujourd'hui votre principale source de revenu, pendant combien de temps pourriez-vous couvrir vos dépenses normales?", "Plus d'un an", "De six à douze mois", "De un à six mois", "Moins d'un mois"],
    ["Quel énoncé décrit le mieux vos habitudes d'épargne?", "J'épargne automatiquement à chaque paie.", "J'épargne régulièrement, mais pas toujours.", "J'épargne seulement lorsqu'il reste de l'argent.", "J'épargne rarement."],
    ["Lors d'un achat, qu'est-ce qui influence le plus votre décision?", "Mon plan financier écrit et mon budget.", "Je compare la valeur avant d'acheter.", "Je décide généralement selon mes émotions.", "J'achète ce que je veux avec peu de planification."]],
  ["Investissement et actifs financiers",
    ["Comment décririez-vous votre portefeuille d'investissement actuel?", "Diversifié entre plusieurs catégories d'actifs.", "Principalement des actions et des fonds communs.", "Principalement des comptes d'épargne.", "Je n'investis pas actuellement."],
    ["Comprenez-vous bien la différence entre actions, FNB/ETF et obligations?", "Très bien — je gère activement mon portefeuille.", "Assez bien — je comprends les bases.", "Un peu — j'en ai lu, mais je n'investis pas.", "Pas du tout."],
    ["Combien versez-vous chaque année dans un compte de retraite?", "La cotisation maximale permise.", "Un montant constant et significatif.", "Occasionnellement ou très peu.", "Rien actuellement."],
    ["Comment gérez-vous le risque d'investissement?", "J'utilise une stratégie documentée de gestion du risque.", "Je diversifie et rééquilibre périodiquement.", "J'évite surtout le risque en conservant des liquidités.", "Je n'ai pas beaucoup réfléchi à la gestion du risque."]],
  ["Immobilier",
    ["Possédez-vous actuellement des immeubles de placement?", "Oui — plusieurs propriétés générant des flux de trésorerie.", "Oui — une propriété de placement.", "Non, mais je fais activement des recherches.", "Non, et je ne l'ai pas envisagé."],
    ["Comprenez-vous bien l'analyse des flux de trésorerie immobiliers?", "Très bien — je calcule les taux de capitalisation et le NOI.", "Assez bien — je comprends les bases des flux de trésorerie.", "Un peu — j'ai entendu parler de ces concepts.", "Pas du tout."],
    ["Connaissez-vous le financement immobilier créatif?", "Très bien — j'ai utilisé subject-to, financement vendeur, etc.", "Je connais les concepts, mais je ne les ai pas utilisés.", "J'en ai entendu parler, mais je ne les comprends pas bien.", "Pas du tout."],
    ["Quelle est votre approche pour bâtir un patrimoine immobilier?", "Acquisitions actives avec une stratégie documentée.", "J'apprends et je me prépare à acquérir.", "Intérêt passif, sans plan concret.", "L'immobilier ne fait pas partie de mon plan financier."]],
  ["Entreprise",
    ["Possédez-vous ou exploitez-vous une entreprise?", "Oui — rentable et en croissance.", "Oui — au démarrage ou au seuil de rentabilité.", "Non, mais je planifie activement d'en créer une.", "Je ne possède pas d'entreprise."],
    ["Suivez-vous bien les KPI de votre entreprise?", "Tableau de bord hebdomadaire avec indicateurs clés.", "Examen mensuel des principales mesures financières.", "Examen occasionnel lorsque des problèmes surviennent.", "Je ne suis pas les KPI."],
    ["Comprenez-vous bien les marges bénéficiaires de votre entreprise?", "Précisément — j'optimise constamment les marges.", "Assez bien — je les examine régulièrement.", "Un peu — je sais si je suis rentable ou non.", "Je ne suis pas certain de mes marges."],
    ["Quelle est votre approche actuelle de la croissance de l'entreprise?", "Plan documenté de mise à l'échelle avec systèmes et délégation.", "Croissance sans plan formel.", "Concentré sur la survie plutôt que sur la croissance.", "Aucune entreprise à faire croître actuellement."]],
  ["Gestion des risques",
    ["Dans quelle mesure votre revenu est-il protégé contre l'invalidité ou la maladie?", "Entièrement assuré avec protection du revenu et invalidité.", "Partiellement couvert par les avantages de l'employeur.", "Couverture minimale.", "Aucune assurance de protection du revenu."],
    ["Comment vos actifs personnels sont-ils protégés juridiquement?", "LLC/sociétés, fiducies et structures juridiques en place.", "Certaines protections juridiques sont en place.", "Je prévois mettre en place une protection.", "Aucune protection juridique des actifs."],
    ["Êtes-vous financièrement préparé à un important ralentissement économique?", "Très préparé — réserves diversifiées et liquides.", "Assez préparé avec certaines réserves.", "Préparation minimale.", "Pas préparé du tout."],
    ["Avez-vous un plan successoral (testament, bénéficiaires, procuration)?", "Plan complet et récemment mis à jour.", "Documents de base en place, mais incomplets.", "Commencé mais non terminé.", "Aucun plan successoral."]],
  ["Profil financier",
    ["Vos objectifs financiers à long terme sont-ils clairement définis?", "Objectifs écrits et précis avec échéances et plans.", "Objectifs généraux auxquels je pense régulièrement.", "Idées vagues de ce que je veux financièrement.", "Je n'ai pas fixé d'objectifs financiers."],
    ["Comment décririez-vous votre éducation financière?", "Approfondie — j'étudie continuellement l'argent et l'investissement.", "Bonne — j'ai étudié plusieurs domaines clés.", "De base — une certaine littératie financière générale.", "Formation financière formelle minimale."],
    ["Dans l'ensemble, vos habitudes financières sont-elles constantes?", "Très disciplinées et constantes.", "Généralement constantes avec quelques écarts.", "Inconstantes — j'ai du mal à maintenir de bonnes habitudes.", "Mauvaises habitudes financières que je veux changer."],
    ["Qu'est-ce qui décrit le mieux votre mentorat ou votre communauté financière?", "Mentor financier actif et groupe d'apprentissage entre pairs.", "Quelques conseils provenant de livres, cours ou conseillers.", "Principalement autonome avec peu de conseils.", "J'apprends entièrement seul sans accompagnement."]],
];

const PT_SECTIONS: SectionCopy[] = [
  ["Gestão financeira pessoal",
    ["Com que frequência você prepara e segue um orçamento por escrito?", "Todos os meses", "Na maioria dos meses", "Ocasionalmente", "Nunca"],
    ["Se hoje perdesse sua principal fonte de renda, por quanto tempo conseguiria cobrir suas despesas normais?", "Mais de um ano", "De seis a doze meses", "De um a seis meses", "Menos de um mês"],
    ["Qual frase melhor descreve seus hábitos de poupança?", "Poupo automaticamente a cada pagamento.", "Poupo regularmente, mas não sempre.", "Poupo apenas quando sobra dinheiro.", "Raramente poupo dinheiro."],
    ["Ao fazer uma compra, o que normalmente mais influencia sua decisão?", "Meu plano financeiro escrito e orçamento.", "Comparo o valor antes de comprar.", "Normalmente decido com base na emoção.", "Compro o que quero sem muito planejamento."]],
  ["Investimentos e ativos financeiros",
    ["Como você descreveria sua carteira atual de investimentos?", "Diversificada entre várias classes de ativos.", "Principalmente ações e fundos.", "Principalmente contas de poupança.", "Atualmente não invisto."],
    ["Quão bem você entende a diferença entre ações, ETFs e títulos?", "Muito bem — gerencio ativamente minha carteira.", "Moderadamente — entendo o básico.", "Um pouco — já li sobre eles, mas não invisto.", "Nada."],
    ["Quanto você contribui anualmente para uma conta de aposentadoria?", "Contribuição máxima permitida.", "Um valor consistente e significativo.", "Ocasionalmente ou minimamente.", "Nada atualmente."],
    ["Como você gerencia o risco de investimento?", "Uso uma estratégia documentada de gestão de risco.", "Diversifico e rebalanceio periodicamente.", "Evito principalmente o risco mantendo dinheiro em caixa.", "Não pensei muito sobre gestão de risco."]],
  ["Imóveis",
    ["Você possui atualmente imóveis para investimento?", "Sim — várias propriedades gerando fluxo de caixa.", "Sim — uma propriedade de investimento.", "Não, mas estou pesquisando ativamente.", "Não, e ainda não considerei."],
    ["Quão bem você entende a análise de fluxo de caixa imobiliário?", "Muito bem — calculo cap rate e NOI.", "Moderadamente — entendo o básico do fluxo de caixa.", "Um pouco — já ouvi falar desses conceitos.", "Nada."],
    ["Quão familiarizado você está com financiamento imobiliário criativo?", "Muito — já usei subject-to, financiamento do vendedor etc.", "Conheço os conceitos, mas não os utilizei.", "Já ouvi falar, mas não entendo bem.", "Nada familiarizado."],
    ["Qual é sua abordagem para construir riqueza com imóveis?", "Aquisição ativa com estratégia documentada.", "Aprendendo e me preparando para adquirir.", "Interesse passivo, sem plano concreto.", "Imóveis não fazem parte do meu plano financeiro."]],
  ["Negócios",
    ["Você possui ou administra um negócio?", "Sim — lucrativo e em crescimento.", "Sim — em fase inicial ou no ponto de equilíbrio.", "Não, mas estou planejando ativamente começar um.", "Não possuo negócio."],
    ["Quão bem você acompanha os KPIs do seu negócio?", "Painel semanal com métricas-chave de desempenho.", "Revisão mensal das principais métricas financeiras.", "Revisão ocasional quando surgem problemas.", "Não acompanho KPIs."],
    ["Quão bem você entende as margens de lucro do seu negócio?", "Precisamente — otimizo as margens de forma consistente.", "Moderadamente — reviso regularmente.", "Um pouco — sei se tenho lucro ou prejuízo.", "Não tenho certeza das minhas margens."],
    ["Qual é sua abordagem atual para o crescimento do negócio?", "Plano documentado de escala com sistemas e delegação.", "Crescendo, mas sem um plano formal.", "Focado em sobreviver em vez de crescer.", "Atualmente não tenho negócio para fazer crescer."]],
  ["Gestão de riscos",
    ["Quão protegida está sua renda contra incapacidade ou doença?", "Totalmente segurada com proteção por incapacidade e renda.", "Parcialmente coberta por benefícios do empregador.", "Cobertura mínima.", "Sem seguro de proteção de renda."],
    ["Como seus ativos pessoais estão protegidos legalmente?", "LLCs, trusts e estruturas legais implementadas.", "Alguma proteção legal implementada.", "Estou planejando implementar proteção.", "Nenhuma proteção legal de ativos."],
    ["Quão preparado financeiramente você está para uma grande recessão econômica?", "Muito preparado — reservas diversificadas e líquidas.", "Razoavelmente preparado com algumas reservas.", "Minimamente preparado.", "Nada preparado."],
    ["Você possui um plano sucessório (testamento, beneficiários, procuração)?", "Plano completo e atualizado recentemente.", "Documentos básicos, mas não abrangentes.", "Iniciado, mas não concluído.", "Sem plano sucessório."]],
  ["Perfil financeiro",
    ["Quão claramente definidos estão seus objetivos financeiros de longo prazo?", "Objetivos escritos e específicos com prazos e planos.", "Objetivos gerais nos quais penso regularmente.", "Ideias vagas sobre o que quero financeiramente.", "Não defini objetivos financeiros."],
    ["Como você descreveria sua educação financeira?", "Extensa — estudo continuamente dinheiro e investimentos.", "Boa — estudei várias áreas importantes.", "Básica — alguma alfabetização financeira geral.", "Educação financeira formal mínima."],
    ["Quão consistentes são seus hábitos financeiros em geral?", "Muito disciplinados e consistentes.", "Na maioria das vezes consistentes, com alguns deslizes.", "Inconsistentes — tenho dificuldade em manter bons hábitos.", "Hábitos financeiros ruins que quero mudar."],
    ["O que melhor descreve sua mentoria ou comunidade financeira?", "Mentor financeiro ativo e grupo de aprendizagem entre pares.", "Alguma orientação de livros, cursos ou consultores.", "Principalmente autodidata, com pouca orientação.", "Aprendo totalmente por conta própria, sem orientação."]],
];

const DE_SECTIONS: SectionCopy[] = [
  ["Persönliches Finanzmanagement",
    ["Wie oft erstellen und befolgen Sie ein schriftliches Budget?", "Jeden Monat", "In den meisten Monaten", "Gelegentlich", "Nie"],
    ["Wenn Sie heute Ihre Haupteinnahmequelle verlieren würden, wie lange könnten Sie Ihre normalen Ausgaben decken?", "Mehr als ein Jahr", "Sechs bis zwölf Monate", "Ein bis sechs Monate", "Weniger als einen Monat"],
    ["Welche Aussage beschreibt Ihre Spargewohnheiten am besten?", "Ich spare automatisch bei jeder Gehaltszahlung.", "Ich spare regelmäßig, aber nicht konsequent.", "Ich spare nur, wenn Geld übrig bleibt.", "Ich spare selten."],
    ["Was beeinflusst Ihre Entscheidung bei einem Kauf am stärksten?", "Mein schriftlicher Finanzplan und mein Budget.", "Ich vergleiche den Wert vor dem Kauf.", "Ich entscheide meist emotional.", "Ich kaufe, was ich möchte, ohne viel Planung."]],
  ["Investieren und Wertpapiere",
    ["Wie würden Sie Ihr aktuelles Anlageportfolio beschreiben?", "Über mehrere Anlageklassen diversifiziert.", "Überwiegend Aktien und Fonds.", "Überwiegend Sparkonten.", "Ich investiere derzeit nicht."],
    ["Wie gut verstehen Sie den Unterschied zwischen Aktien, ETFs und Anleihen?", "Sehr gut — ich verwalte mein Portfolio aktiv.", "Mittel — ich verstehe die Grundlagen.", "Etwas — ich habe darüber gelesen, investiere aber nicht.", "Gar nicht."],
    ["Wie viel zahlen Sie jährlich in ein Altersvorsorgekonto ein?", "Den maximal zulässigen Betrag.", "Einen regelmäßigen und bedeutenden Betrag.", "Gelegentlich oder nur wenig.", "Derzeit nichts."],
    ["Wie steuern Sie Ihr Anlagerisiko?", "Ich nutze eine dokumentierte Risikomanagementstrategie.", "Ich diversifiziere und gewichte regelmäßig neu.", "Ich vermeide Risiko weitgehend durch hohe Liquidität.", "Ich habe über Risikomanagement kaum nachgedacht."]],
  ["Immobilien",
    ["Besitzen Sie derzeit Anlageimmobilien?", "Ja — mehrere Objekte mit positivem Cashflow.", "Ja — eine Anlageimmobilie.", "Nein, aber ich recherchiere aktiv.", "Nein, und ich habe es nicht erwogen."],
    ["Wie gut verstehen Sie die Cashflow-Analyse bei Immobilien?", "Sehr gut — ich berechne Cap Rate und NOI.", "Mittel — ich verstehe die Cashflow-Grundlagen.", "Etwas — ich kenne diese Begriffe.", "Gar nicht."],
    ["Wie vertraut sind Sie mit kreativer Immobilienfinanzierung?", "Sehr — ich habe Subject-to, Verkäuferfinanzierung usw. genutzt.", "Ich kenne die Konzepte, habe sie aber nicht genutzt.", "Ich habe davon gehört, verstehe sie aber nicht gut.", "Gar nicht vertraut."],
    ["Wie bauen Sie Immobilienvermögen auf?", "Aktive Akquisition mit dokumentierter Strategie.", "Ich lerne und bereite mich auf Käufe vor.", "Passives Interesse ohne konkreten Plan.", "Immobilien sind nicht Teil meines Finanzplans."]],
  ["Unternehmen",
    ["Besitzen oder führen Sie ein Unternehmen?", "Ja — profitabel und wachsend.", "Ja — in der Anfangsphase oder am Break-even.", "Nein, aber ich plane aktiv eine Gründung.", "Kein Unternehmenseigentum."],
    ["Wie gut verfolgen Sie die KPIs Ihres Unternehmens?", "Wöchentliches Dashboard mit Leistungskennzahlen.", "Monatliche Prüfung wichtiger Finanzkennzahlen.", "Gelegentliche Prüfung bei Problemen.", "Ich verfolge keine KPIs."],
    ["Wie gut verstehen Sie die Gewinnmargen Ihres Unternehmens?", "Sehr genau — ich optimiere Margen laufend.", "Mittel — ich prüfe sie regelmäßig.", "Etwas — ich weiß, ob ich Gewinn mache.", "Ich kenne meine Margen nicht genau."],
    ["Wie gehen Sie derzeit an Unternehmenswachstum heran?", "Dokumentierter Skalierungsplan mit Systemen und Delegation.", "Wachstum ohne formellen Plan.", "Fokus auf Überleben statt Wachstum.", "Derzeit kein Unternehmen zum Wachsen."]],
  ["Risikomanagement",
    ["Wie gut ist Ihr Einkommen gegen Invalidität oder Krankheit geschützt?", "Vollständig mit Invaliditäts- und Einkommensschutz versichert.", "Teilweise durch Arbeitgeberleistungen abgedeckt.", "Minimale Deckung.", "Kein Einkommensschutz."],
    ["Wie sind Ihre persönlichen Vermögenswerte rechtlich geschützt?", "Gesellschaften, Trusts und Rechtsstrukturen sind eingerichtet.", "Ein gewisser rechtlicher Schutz besteht.", "Ich plane Schutzmaßnahmen.", "Kein rechtlicher Vermögensschutz."],
    ["Wie gut sind Sie finanziell auf einen starken Wirtschaftsabschwung vorbereitet?", "Sehr gut — diversifizierte und liquide Reserven.", "Etwas vorbereitet mit einigen Reserven.", "Minimal vorbereitet.", "Gar nicht vorbereitet."],
    ["Haben Sie einen Nachlassplan (Testament, Begünstigte, Vollmacht)?", "Vollständig und kürzlich aktualisiert.", "Grundlegende Dokumente vorhanden, aber nicht umfassend.", "Begonnen, aber nicht abgeschlossen.", "Kein Nachlassplan."]],
  ["Finanzprofil",
    ["Wie klar sind Ihre langfristigen finanziellen Ziele definiert?", "Schriftliche, konkrete Ziele mit Zeitplänen und Plänen.", "Allgemeine Ziele, über die ich regelmäßig nachdenke.", "Vage Vorstellungen meiner finanziellen Wünsche.", "Ich habe keine finanziellen Ziele festgelegt."],
    ["Wie würden Sie Ihre Finanzbildung beschreiben?", "Umfassend — ich beschäftige mich ständig mit Geld und Investieren.", "Gut — ich habe mehrere wichtige Bereiche studiert.", "Grundlegend — allgemeine Finanzkenntnisse.", "Minimale formale Finanzbildung."],
    ["Wie konsequent sind Ihre finanziellen Gewohnheiten insgesamt?", "Sehr diszipliniert und konsequent.", "Meist konsequent mit gelegentlichen Ausnahmen.", "Inkonsistent — gute Gewohnheiten fallen mir schwer.", "Schlechte Gewohnheiten, die ich ändern möchte."],
    ["Was beschreibt Ihr finanzielles Mentoring oder Ihre Community am besten?", "Aktiver Finanzmentor und Lerngruppe.", "Etwas Orientierung durch Bücher, Kurse oder Berater.", "Meist selbstgesteuert mit wenig Orientierung.", "Vollständig selbstständig ohne Anleitung."]],
];

const NL_SECTIONS: SectionCopy[] = [
  ["Persoonlijk financieel beheer",
    ["Hoe vaak maakt en volgt u een schriftelijk budget?", "Elke maand", "De meeste maanden", "Af en toe", "Nooit"],
    ["Als u vandaag uw belangrijkste inkomen verliest, hoe lang kunt u uw normale uitgaven betalen?", "Meer dan een jaar", "Zes tot twaalf maanden", "Eén tot zes maanden", "Minder dan één maand"],
    ["Welke uitspraak beschrijft uw spaargedrag het best?", "Ik spaar automatisch bij elke salarisbetaling.", "Ik spaar regelmatig, maar niet altijd consequent.", "Ik spaar alleen als er geld overblijft.", "Ik spaar zelden."],
    ["Wat beïnvloedt uw aankoopbeslissing meestal het meest?", "Mijn schriftelijke financiële plan en budget.", "Ik vergelijk waarde voordat ik koop.", "Ik beslis meestal op basis van emotie.", "Ik koop wat ik wil zonder veel planning."]],
  ["Beleggen en financiële activa",
    ["Hoe zou u uw huidige beleggingsportefeuille beschrijven?", "Gespreid over meerdere activaklassen.", "Voornamelijk aandelen en beleggingsfondsen.", "Voornamelijk spaarrekeningen.", "Ik beleg momenteel niet."],
    ["Hoe goed begrijpt u het verschil tussen aandelen, ETF's en obligaties?", "Zeer goed — ik beheer mijn portefeuille actief.", "Redelijk — ik begrijp de basis.", "Enigszins — ik heb erover gelezen maar beleg niet.", "Helemaal niet."],
    ["Hoeveel draagt u jaarlijks bij aan een pensioenrekening?", "De maximaal toegestane bijdrage.", "Een consistent en betekenisvol bedrag.", "Af en toe of minimaal.", "Momenteel niets."],
    ["Hoe beheert u beleggingsrisico?", "Ik gebruik een gedocumenteerde risicostrategie.", "Ik spreid en herbalanseer periodiek.", "Ik vermijd risico vooral door cash aan te houden.", "Ik heb weinig nagedacht over risicobeheer."]],
  ["Vastgoed",
    ["Bezit u momenteel vastgoed als investering?", "Ja — meerdere panden die cashflow genereren.", "Ja — één beleggingspand.", "Nee, maar ik doe actief onderzoek.", "Nee, en ik heb het niet overwogen."],
    ["Hoe goed begrijpt u cashflowanalyse voor vastgoed?", "Zeer goed — ik bereken cap rates en NOI.", "Redelijk — ik begrijp de basis van cashflow.", "Enigszins — ik heb van deze begrippen gehoord.", "Helemaal niet."],
    ["Hoe bekend bent u met creatieve vastgoedfinanciering?", "Zeer — ik heb subject-to, verkopersfinanciering enz. gebruikt.", "Ik ken de concepten maar heb ze niet gebruikt.", "Ik heb ervan gehoord maar begrijp ze niet goed.", "Helemaal niet bekend."],
    ["Wat is uw aanpak om vermogen op te bouwen met vastgoed?", "Actieve aankoop met een gedocumenteerde strategie.", "Leren en voorbereiden op aankoop.", "Passief geïnteresseerd maar zonder concreet plan.", "Vastgoed maakt geen deel uit van mijn financiële plan."]],
  ["Ondernemen",
    ["Bezit of runt u een bedrijf?", "Ja — winstgevend en groeiend.", "Ja — in de beginfase of break-even.", "Nee, maar ik plan actief om er een te starten.", "Geen bedrijfseigendom."],
    ["Hoe goed volgt u de KPI's van uw bedrijf?", "Wekelijks dashboard met kernprestatie-indicatoren.", "Maandelijkse beoordeling van belangrijke financiële cijfers.", "Af en toe beoordelen wanneer problemen ontstaan.", "Ik volg geen KPI's."],
    ["Hoe goed begrijpt u de winstmarges van uw bedrijf?", "Precies — ik optimaliseer marges voortdurend.", "Redelijk — ik beoordeel ze regelmatig.", "Enigszins — ik weet of ik winstgevend ben.", "Ik weet mijn marges niet zeker."],
    ["Wat is uw huidige aanpak voor bedrijfsgroei?", "Gedocumenteerd schaalplan met systemen en delegatie.", "Groei zonder formeel plan.", "Gericht op overleven in plaats van groeien.", "Momenteel geen bedrijf om te laten groeien."]],
  ["Risicobeheer",
    ["Hoe goed is uw inkomen beschermd tegen arbeidsongeschiktheid of ziekte?", "Volledig verzekerd met inkomens- en arbeidsongeschiktheidsbescherming.", "Gedeeltelijk gedekt via werkgeversvoorzieningen.", "Minimale dekking.", "Geen inkomensbescherming."],
    ["Hoe zijn uw persoonlijke bezittingen juridisch beschermd?", "Bedrijfsstructuren, trusts en juridische bescherming zijn ingericht.", "Enige juridische bescherming is aanwezig.", "Ik ben van plan bescherming in te richten.", "Geen juridische vermogensbescherming."],
    ["Hoe financieel voorbereid bent u op een grote economische neergang?", "Zeer voorbereid — gespreide en liquide reserves.", "Enigszins voorbereid met enkele reserves.", "Minimaal voorbereid.", "Helemaal niet voorbereid."],
    ["Heeft u een nalatenschapsplan (testament, begunstigden, volmacht)?", "Compleet en recent bijgewerkt.", "Basisdocumenten aanwezig, maar niet volledig.", "Begonnen maar niet voltooid.", "Geen nalatenschapsplan."]],
  ["Financieel profiel",
    ["Hoe duidelijk zijn uw financiële doelen op lange termijn gedefinieerd?", "Schriftelijke, specifieke doelen met tijdlijnen en plannen.", "Algemene doelen waar ik regelmatig aan denk.", "Vage ideeën over wat ik financieel wil.", "Ik heb geen financiële doelen vastgesteld."],
    ["Hoe zou u uw financiële opleiding beschrijven?", "Uitgebreid — ik bestudeer voortdurend geld en beleggen.", "Goed — ik heb meerdere belangrijke gebieden bestudeerd.", "Basis — enige algemene financiële kennis.", "Minimale formele financiële opleiding."],
    ["Hoe consistent zijn uw financiële gewoonten in het algemeen?", "Zeer gedisciplineerd en consistent.", "Meestal consistent met af en toe een terugval.", "Inconsistent — ik vind het moeilijk goede gewoonten vol te houden.", "Slechte financiële gewoonten die ik wil veranderen."],
    ["Wat beschrijft uw financiële mentoring of community het best?", "Actieve financiële mentor en leergroep met anderen.", "Enige begeleiding via boeken, cursussen of adviseurs.", "Vooral zelfgestuurd met weinig begeleiding.", "Volledig zelfstandig leren zonder begeleiding."]],
];

const LINKS: Record<CompetencyArea, string[]> = {
  personalFinance: ["/curriculum", "/curriculum/WHITE/l1"],
  investing: ["/curriculum/WHITE/l1", "/curriculum/GOLD/l1"],
  realEstate: ["/curriculum/RED/l1", "/curriculum/RED/l1"],
  business: ["/curriculum/BLUE/l1", "/curriculum/BLUE/l1"],
  riskManagement: ["/curriculum/PURPLE/l1", "/curriculum/RED/l1"],
  financialProfile: ["/curriculum", "/curriculum"],
};

function rec(area: CompetencyArea, titles: [string, string], descs: [string, string]) {
  return titles.map((title, index) => ({ title, desc: descs[index], href: LINKS[area][index] }));
}

const EN_RESULTS: ResultsCopy = {
  loading: "Loading results…", startingPoint: "Your Starting Point", profileTitle: "Your Financial Intelligence Profile",
  profileIntro: "This is not a pass/fail grade. It is a baseline showing what you already understand and where focused learning may create the greatest opportunity for growth.",
  samplePrefix: "Showing sample results. Complete the", freeDiagnostic: "free diagnostic", sampleSuffix: "to see your personalized profile.",
  startingScore: "Financial Intelligence Starting Score", currentBenchmark: "Current benchmark", strengthsTitle: "Your Greatest Strengths",
  strengthsIntro: "These areas can become pieces you use as you learn to make broader financial decisions.", opportunitiesTitle: "Your Greatest Opportunities",
  opportunitiesIntro: "These are not failures. They are the areas where targeted learning can expand your financial options.", recommendedMove: "Recommended First Move",
  startWith: "Start With", recommendationIntro: "Based on this diagnostic, this is your strongest opportunity for focused improvement. Edunancial can then help you connect that knowledge with the other financial pieces as you advance.",
  priority: "Priority", startPath: "Start this path", chessTitle: "Learn the Pieces. Then Learn to Use Them Together.",
  chessBody: "Edunancial begins with financial literacy, then develops the ability to apply, analyze, and ultimately coordinate business, real estate, investing, taxes, law, sales, and leadership in wealth-building decisions.",
  startRecommended: "Start My Recommended Learning", saveProgress: "Save Progress in Dashboard", membershipOptions: "See Membership Options",
  areas: { personalFinance: "Personal Finance", investing: "Investing & Paper Assets", realEstate: "Real Estate", business: "Business Ownership", riskManagement: "Risk Management", financialProfile: "Financial Decision-Making" },
  levels: { Master: "Master", Advanced: "Advanced", Proficient: "Proficient", Developing: "Developing", Foundational: "Foundational", Beginning: "Beginning" },
  recommendations: {
    personalFinance: rec("personalFinance", ["Build Your Financial Defense", "Then Build Financial Offense"], ["Strengthen cash flow, reserves, credit, and debt decisions before deploying more capital.", "Use that stronger foundation to begin evaluating ownership and investment opportunities."]),
    investing: rec("investing", ["WHITE — Paper Assets", "GOLD — Investing"], ["Learn how stocks, bonds, ETFs, diversification, risk, and financial markets work.", "Develop the ability to decide where capital should go and why."]),
    realEstate: rec("realEstate", ["RED — Real Estate", "Build Toward Deal Analysis"], ["Learn property, financing, cash flow, leverage, risk, and the mechanics of real-estate ownership.", "Progress from understanding property to evaluating whether an acquisition actually builds wealth."]),
    business: rec("business", ["BLUE — Business", "Build Toward Ownership"], ["Learn revenue, profit, margins, business ownership, financing, and entrepreneurship fundamentals.", "Use the curriculum to move from understanding a business to operating and evaluating one."]),
    riskManagement: rec("riskManagement", ["Strengthen Financial Defense", "Learn Before You Leverage"], ["Improve reserves, downside planning, insurance awareness, and risk recognition.", "Understand downside exposure before using debt or capital to pursue higher returns."]),
    financialProfile: rec("financialProfile", ["Develop Financial Intelligence", "Start With the Edunancial Foundations"], ["Practice comparing alternatives by cash flow, risk, liquidity, taxes, leverage, and opportunity cost.", "Learn each financial chess piece before combining them into more advanced strategies."]),
  },
};

function translatedResults(lang: "it" | "es" | "fr" | "pt" | "de" | "nl"): ResultsCopy {
  if (lang === "it") return {
    ...EN_RESULTS,
    loading: "Caricamento risultati…", startingPoint: "Il tuo punto di partenza", profileTitle: "Il tuo profilo di intelligenza finanziaria",
    profileIntro: "Non è un voto di promozione o bocciatura. È una base che mostra ciò che già comprendi e dove un apprendimento mirato può creare la maggiore opportunità di crescita.",
    samplePrefix: "Stai visualizzando risultati di esempio. Completa la", freeDiagnostic: "valutazione gratuita", sampleSuffix: "per vedere il tuo profilo personalizzato.",
    startingScore: "Punteggio iniziale di intelligenza finanziaria", currentBenchmark: "Livello attuale", strengthsTitle: "I tuoi maggiori punti di forza",
    strengthsIntro: "Queste aree possono diventare strumenti che userai per prendere decisioni finanziarie più ampie.", opportunitiesTitle: "Le tue maggiori opportunità",
    opportunitiesIntro: "Non sono fallimenti. Sono le aree in cui un apprendimento mirato può ampliare le tue opzioni finanziarie.", recommendedMove: "Prima mossa consigliata",
    startWith: "Inizia da", recommendationIntro: "In base a questa valutazione, questa è la tua migliore opportunità di miglioramento mirato. Edunancial può poi aiutarti a collegare questa conoscenza agli altri elementi finanziari mentre avanzi.",
    priority: "Priorità", startPath: "Inizia questo percorso", chessTitle: "Impara i pezzi. Poi impara a usarli insieme.",
    chessBody: "Edunancial parte dall'alfabetizzazione finanziaria e sviluppa poi la capacità di applicare, analizzare e coordinare impresa, immobiliare, investimenti, tasse, diritto, vendite e leadership nelle decisioni di costruzione della ricchezza.",
    startRecommended: "Inizia il percorso consigliato", saveProgress: "Salva i progressi nella dashboard", membershipOptions: "Vedi le opzioni di abbonamento",
    areas: { personalFinance: "Finanza personale", investing: "Investimenti e attività finanziarie", realEstate: "Immobiliare", business: "Proprietà d'impresa", riskManagement: "Gestione del rischio", financialProfile: "Decisioni finanziarie" },
    levels: { Master: "Maestria", Advanced: "Avanzato", Proficient: "Competente", Developing: "In sviluppo", Foundational: "Fondamentale", Beginning: "Iniziale" },
    recommendations: {
      personalFinance: rec("personalFinance", ["Costruisci la tua difesa finanziaria", "Poi costruisci l'attacco finanziario"], ["Rafforza flusso di cassa, riserve, credito e decisioni sul debito prima di impiegare altro capitale.", "Usa questa base più solida per iniziare a valutare opportunità di proprietà e investimento."]),
      investing: rec("investing", ["WHITE — Attività finanziarie", "GOLD — Investimenti"], ["Impara come funzionano azioni, obbligazioni, ETF, diversificazione, rischio e mercati finanziari.", "Sviluppa la capacità di decidere dove allocare il capitale e perché."]),
      realEstate: rec("realEstate", ["RED — Immobiliare", "Verso l'analisi delle operazioni"], ["Impara proprietà, finanziamento, flusso di cassa, leva, rischio e meccanismi della proprietà immobiliare.", "Passa dalla comprensione della proprietà alla valutazione se un'acquisizione costruisce davvero ricchezza."]),
      business: rec("business", ["BLUE — Impresa", "Verso la proprietà"], ["Impara ricavi, profitto, margini, proprietà d'impresa, finanziamento e fondamenti dell'imprenditorialità.", "Usa il curriculum per passare dalla comprensione di un'impresa alla sua gestione e valutazione."]),
      riskManagement: rec("riskManagement", ["Rafforza la difesa finanziaria", "Impara prima di usare la leva"], ["Migliora riserve, pianificazione del rischio, consapevolezza assicurativa e riconoscimento dei rischi.", "Comprendi l'esposizione alle perdite prima di usare debito o capitale per cercare rendimenti maggiori."]),
      financialProfile: rec("financialProfile", ["Sviluppa l'intelligenza finanziaria", "Inizia dalle fondamenta Edunancial"], ["Confronta alternative per flusso di cassa, rischio, liquidità, tasse, leva e costo opportunità.", "Impara ogni pezzo della scacchiera finanziaria prima di combinarli in strategie più avanzate."]),
    },
  };
  if (lang === "es") return {
    ...EN_RESULTS,
    loading: "Cargando resultados…", startingPoint: "Tu punto de partida", profileTitle: "Tu perfil de inteligencia financiera",
    profileIntro: "No es una calificación de aprobado o reprobado. Es una base que muestra lo que ya entiendes y dónde el aprendizaje enfocado puede crear la mayor oportunidad de crecimiento.",
    samplePrefix: "Estás viendo resultados de ejemplo. Completa el", freeDiagnostic: "diagnóstico gratuito", sampleSuffix: "para ver tu perfil personalizado.",
    startingScore: "Puntuación inicial de inteligencia financiera", currentBenchmark: "Nivel actual", strengthsTitle: "Tus mayores fortalezas",
    strengthsIntro: "Estas áreas pueden convertirse en piezas que uses al aprender a tomar decisiones financieras más amplias.", opportunitiesTitle: "Tus mayores oportunidades",
    opportunitiesIntro: "No son fracasos. Son las áreas donde el aprendizaje enfocado puede ampliar tus opciones financieras.", recommendedMove: "Primer movimiento recomendado",
    startWith: "Comienza con", recommendationIntro: "Según este diagnóstico, esta es tu mayor oportunidad de mejora enfocada. Edunancial puede ayudarte a conectar ese conocimiento con las demás piezas financieras a medida que avances.",
    priority: "Prioridad", startPath: "Comienza este camino", chessTitle: "Aprende las piezas. Luego aprende a usarlas juntas.",
    chessBody: "Edunancial comienza con alfabetización financiera y desarrolla la capacidad de aplicar, analizar y coordinar negocios, bienes raíces, inversiones, impuestos, derecho, ventas y liderazgo en decisiones para crear riqueza.",
    startRecommended: "Comenzar mi aprendizaje recomendado", saveProgress: "Guardar progreso en el panel", membershipOptions: "Ver opciones de membresía",
    areas: { personalFinance: "Finanzas personales", investing: "Inversiones y activos financieros", realEstate: "Bienes raíces", business: "Propiedad de negocios", riskManagement: "Gestión de riesgos", financialProfile: "Toma de decisiones financieras" },
    levels: { Master: "Maestro", Advanced: "Avanzado", Proficient: "Competente", Developing: "En desarrollo", Foundational: "Fundamental", Beginning: "Inicial" },
    recommendations: EN_RESULTS.recommendations,
  };
  if (lang === "fr") return {
    ...EN_RESULTS,
    loading: "Chargement des résultats…", startingPoint: "Votre point de départ", profileTitle: "Votre profil d'intelligence financière",
    profileIntro: "Il ne s'agit pas d'une note de réussite ou d'échec. C'est un point de référence montrant ce que vous comprenez déjà et où un apprentissage ciblé peut créer la meilleure occasion de progression.",
    samplePrefix: "Résultats d'exemple affichés. Faites le", freeDiagnostic: "diagnostic gratuit", sampleSuffix: "pour voir votre profil personnalisé.",
    startingScore: "Score initial d'intelligence financière", currentBenchmark: "Niveau actuel", strengthsTitle: "Vos principales forces",
    strengthsIntro: "Ces domaines peuvent devenir des pièces que vous utiliserez pour prendre des décisions financières plus larges.", opportunitiesTitle: "Vos meilleures possibilités de progression",
    opportunitiesIntro: "Ce ne sont pas des échecs. Ce sont les domaines où un apprentissage ciblé peut élargir vos options financières.", recommendedMove: "Premier mouvement recommandé",
    startWith: "Commencez par", recommendationIntro: "Selon ce diagnostic, c'est votre meilleure occasion d'amélioration ciblée. Edunancial peut ensuite vous aider à relier ces connaissances aux autres pièces financières.",
    priority: "Priorité", startPath: "Commencer ce parcours", chessTitle: "Apprenez les pièces. Puis apprenez à les utiliser ensemble.",
    chessBody: "Edunancial commence par la littératie financière, puis développe la capacité d'appliquer, d'analyser et de coordonner entreprise, immobilier, investissement, fiscalité, droit, ventes et leadership dans les décisions de création de patrimoine.",
    startRecommended: "Commencer mon parcours recommandé", saveProgress: "Enregistrer les progrès", membershipOptions: "Voir les options d'abonnement",
    areas: { personalFinance: "Finances personnelles", investing: "Investissement et actifs financiers", realEstate: "Immobilier", business: "Propriété d'entreprise", riskManagement: "Gestion des risques", financialProfile: "Prise de décision financière" },
    levels: { Master: "Maîtrise", Advanced: "Avancé", Proficient: "Compétent", Developing: "En développement", Foundational: "Fondamental", Beginning: "Débutant" },
    recommendations: EN_RESULTS.recommendations,
  };
  if (lang === "pt") return {
    ...EN_RESULTS,
    loading: "Carregando resultados…", startingPoint: "Seu ponto de partida", profileTitle: "Seu perfil de inteligência financeira",
    profileIntro: "Não é uma nota de aprovação ou reprovação. É uma linha de base que mostra o que você já entende e onde o aprendizado direcionado pode criar a maior oportunidade de crescimento.",
    samplePrefix: "Exibindo resultados de exemplo. Faça o", freeDiagnostic: "diagnóstico gratuito", sampleSuffix: "para ver seu perfil personalizado.",
    startingScore: "Pontuação inicial de inteligência financeira", currentBenchmark: "Nível atual", strengthsTitle: "Seus maiores pontos fortes",
    strengthsIntro: "Essas áreas podem se tornar peças que você usa ao aprender a tomar decisões financeiras mais amplas.", opportunitiesTitle: "Suas maiores oportunidades",
    opportunitiesIntro: "Não são fracassos. São as áreas em que o aprendizado direcionado pode ampliar suas opções financeiras.", recommendedMove: "Primeiro movimento recomendado",
    startWith: "Comece por", recommendationIntro: "Com base neste diagnóstico, esta é sua maior oportunidade de melhoria focada. A Edunancial pode ajudar a conectar esse conhecimento às demais peças financeiras conforme você avança.",
    priority: "Prioridade", startPath: "Começar este caminho", chessTitle: "Aprenda as peças. Depois aprenda a usá-las juntas.",
    chessBody: "A Edunancial começa com alfabetização financeira e desenvolve a capacidade de aplicar, analisar e coordenar negócios, imóveis, investimentos, impostos, direito, vendas e liderança em decisões de construção de riqueza.",
    startRecommended: "Iniciar meu aprendizado recomendado", saveProgress: "Salvar progresso no painel", membershipOptions: "Ver opções de assinatura",
    areas: { personalFinance: "Finanças pessoais", investing: "Investimentos e ativos financeiros", realEstate: "Imóveis", business: "Propriedade de negócios", riskManagement: "Gestão de riscos", financialProfile: "Tomada de decisões financeiras" },
    levels: { Master: "Mestre", Advanced: "Avançado", Proficient: "Proficiente", Developing: "Em desenvolvimento", Foundational: "Fundamental", Beginning: "Iniciante" },
    recommendations: EN_RESULTS.recommendations,
  };
  if (lang === "de") return {
    ...EN_RESULTS,
    loading: "Ergebnisse werden geladen…", startingPoint: "Ihr Ausgangspunkt", profileTitle: "Ihr Profil finanzieller Intelligenz",
    profileIntro: "Dies ist keine Bestehens- oder Durchfallnote. Es ist eine Ausgangsbasis, die zeigt, was Sie bereits verstehen und wo gezieltes Lernen das größte Wachstumspotenzial schafft.",
    samplePrefix: "Beispielergebnisse. Absolvieren Sie die", freeDiagnostic: "kostenlose Diagnose", sampleSuffix: "für Ihr persönliches Profil.",
    startingScore: "Ausgangswert finanzielle Intelligenz", currentBenchmark: "Aktuelles Niveau", strengthsTitle: "Ihre größten Stärken",
    strengthsIntro: "Diese Bereiche können zu Bausteinen werden, die Sie bei umfassenderen Finanzentscheidungen einsetzen.", opportunitiesTitle: "Ihre größten Chancen",
    opportunitiesIntro: "Das sind keine Fehler. Es sind Bereiche, in denen gezieltes Lernen Ihre finanziellen Möglichkeiten erweitern kann.", recommendedMove: "Empfohlener erster Schritt",
    startWith: "Beginnen mit", recommendationIntro: "Auf Basis dieser Diagnose liegt hier Ihre größte Chance für gezielte Verbesserung. Edunancial hilft Ihnen anschließend, dieses Wissen mit den anderen finanziellen Bausteinen zu verbinden.",
    priority: "Priorität", startPath: "Diesen Pfad starten", chessTitle: "Lernen Sie die Figuren. Dann lernen Sie, sie gemeinsam einzusetzen.",
    chessBody: "Edunancial beginnt mit Finanzwissen und entwickelt die Fähigkeit, Unternehmen, Immobilien, Investitionen, Steuern, Recht, Vertrieb und Führung bei Vermögensentscheidungen anzuwenden, zu analysieren und zu koordinieren.",
    startRecommended: "Empfohlenes Lernen starten", saveProgress: "Fortschritt im Dashboard speichern", membershipOptions: "Mitgliedschaftsoptionen ansehen",
    areas: { personalFinance: "Persönliche Finanzen", investing: "Investieren und Wertpapiere", realEstate: "Immobilien", business: "Unternehmenseigentum", riskManagement: "Risikomanagement", financialProfile: "Finanzielle Entscheidungsfindung" },
    levels: { Master: "Meister", Advanced: "Fortgeschritten", Proficient: "Kompetent", Developing: "In Entwicklung", Foundational: "Grundlegend", Beginning: "Anfang" },
    recommendations: EN_RESULTS.recommendations,
  };
  return {
    ...EN_RESULTS,
    loading: "Resultaten laden…", startingPoint: "Uw startpunt", profileTitle: "Uw profiel voor financiële intelligentie",
    profileIntro: "Dit is geen voldoende/onvoldoende-cijfer. Het is een nulmeting die laat zien wat u al begrijpt en waar gericht leren de grootste groeikans biedt.",
    samplePrefix: "Voorbeeldresultaten. Voltooi de", freeDiagnostic: "gratis diagnose", sampleSuffix: "om uw persoonlijke profiel te zien.",
    startingScore: "Startscore financiële intelligentie", currentBenchmark: "Huidig niveau", strengthsTitle: "Uw grootste sterke punten",
    strengthsIntro: "Deze gebieden kunnen bouwstenen worden die u gebruikt bij bredere financiële beslissingen.", opportunitiesTitle: "Uw grootste kansen",
    opportunitiesIntro: "Dit zijn geen mislukkingen. Het zijn gebieden waar gericht leren uw financiële mogelijkheden kan vergroten.", recommendedMove: "Aanbevolen eerste stap",
    startWith: "Begin met", recommendationIntro: "Op basis van deze diagnose is dit uw grootste kans voor gerichte verbetering. Edunancial kan u daarna helpen deze kennis met de andere financiële bouwstenen te verbinden.",
    priority: "Prioriteit", startPath: "Dit pad starten", chessTitle: "Leer de stukken. Leer ze daarna samen te gebruiken.",
    chessBody: "Edunancial begint met financiële geletterdheid en ontwikkelt vervolgens het vermogen om ondernemerschap, vastgoed, beleggen, belastingen, recht, verkoop en leiderschap toe te passen, analyseren en combineren bij vermogensbeslissingen.",
    startRecommended: "Mijn aanbevolen leerroute starten", saveProgress: "Voortgang opslaan in dashboard", membershipOptions: "Lidmaatschapsopties bekijken",
    areas: { personalFinance: "Persoonlijke financiën", investing: "Beleggen en financiële activa", realEstate: "Vastgoed", business: "Bedrijfseigendom", riskManagement: "Risicobeheer", financialProfile: "Financiële besluitvorming" },
    levels: { Master: "Meester", Advanced: "Gevorderd", Proficient: "Bekwaam", Developing: "In ontwikkeling", Foundational: "Fundamenteel", Beginning: "Begin" },
    recommendations: EN_RESULTS.recommendations,
  };
}

function localeGroup(languageCode: string): "en" | "it" | "es" | "fr" | "pt" | "de" | "nl" {
  const normalized = normalizeLanguageCode(languageCode);
  if (normalized === "it") return "it";
  if (normalized === "es" || normalized === "es-ES") return "es";
  if (normalized === "fr-CA" || normalized === "fr-FR") return "fr";
  if (normalized === "pt-BR" || normalized === "pt-PT") return "pt";
  if (normalized === "de") return "de";
  if (normalized === "nl") return "nl";
  return "en";
}

export function getAssessmentLocale(languageCode: string): AssessmentLocaleCopy {
  const group = localeGroup(languageCode);
  const sectionMap = { en: EN_SECTIONS, it: IT_SECTIONS, es: ES_SECTIONS, fr: FR_SECTIONS, pt: PT_SECTIONS, de: DE_SECTIONS, nl: NL_SECTIONS } as const;
  const sectionWord = { en: "Section", it: "Sezione", es: "Sección", fr: "Section", pt: "Seção", de: "Abschnitt", nl: "Sectie" }[group];
  const wizardMap = {
    en: { sectionOf: "Section", complete: "complete", question: "Question", previous: "Previous", continueToSection: "Continue to Section", calculating: "Calculating results…", completeAssessment: "Complete Assessment", answerAll: "Please answer all questions in this section to continue." },
    it: { sectionOf: "Sezione", complete: "completato", question: "Domanda", previous: "Precedente", continueToSection: "Continua alla sezione", calculating: "Calcolo dei risultati…", completeAssessment: "Completa la valutazione", answerAll: "Rispondi a tutte le domande di questa sezione per continuare." },
    es: { sectionOf: "Sección", complete: "completado", question: "Pregunta", previous: "Anterior", continueToSection: "Continuar a la sección", calculating: "Calculando resultados…", completeAssessment: "Completar evaluación", answerAll: "Responde todas las preguntas de esta sección para continuar." },
    fr: { sectionOf: "Section", complete: "terminé", question: "Question", previous: "Précédent", continueToSection: "Continuer vers la section", calculating: "Calcul des résultats…", completeAssessment: "Terminer l'évaluation", answerAll: "Répondez à toutes les questions de cette section pour continuer." },
    pt: { sectionOf: "Seção", complete: "concluído", question: "Pergunta", previous: "Anterior", continueToSection: "Continuar para a seção", calculating: "Calculando resultados…", completeAssessment: "Concluir avaliação", answerAll: "Responda a todas as perguntas desta seção para continuar." },
    de: { sectionOf: "Abschnitt", complete: "abgeschlossen", question: "Frage", previous: "Zurück", continueToSection: "Weiter zu Abschnitt", calculating: "Ergebnisse werden berechnet…", completeAssessment: "Bewertung abschließen", answerAll: "Bitte beantworten Sie alle Fragen in diesem Abschnitt, um fortzufahren." },
    nl: { sectionOf: "Sectie", complete: "voltooid", question: "Vraag", previous: "Vorige", continueToSection: "Ga door naar sectie", calculating: "Resultaten berekenen…", completeAssessment: "Beoordeling voltooien", answerAll: "Beantwoord alle vragen in deze sectie om door te gaan." },
  } as const;
  return {
    wizard: wizardMap[group],
    sections: buildSections(sectionMap[group] as unknown as SectionCopy[], sectionWord),
    results: group === "en" ? EN_RESULTS : translatedResults(group),
  };
}
