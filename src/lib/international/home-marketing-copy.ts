import { normalizeLanguageCode } from "./languages";

export type HomeMarketingTrack = {
  code: "RED" | "WHITE" | "BLUE" | "GREEN" | "GOLD" | "PURPLE" | "ORANGE" | "BLACK";
  title: string;
  body: string;
  href: string;
  className: string;
};

export type HomeMarketingCopy = {
  heroEyebrow: string;
  heroTitle: string;
  heroBody: string;
  startFree: string;
  takeAssessment: string;
  freeAccessNote: string;
  whyLabel: string;
  whyTitle: string;
  whyBody: string;
  barriers: readonly [string, string][];
  colorLabel: string;
  colorTitle: string;
  colorBody: string;
  explorePathway: string;
  tracks: HomeMarketingTrack[];
  journeyLabel: string;
  journeyTitle: string;
  journeyBody: string;
  journeySteps: string[];
  levelLabel: string;
  assessmentLabel: string;
  assessmentTitle: string;
  assessmentBody: string;
  assessmentCta: string;
  trustLabel: string;
  trustTitle: string;
  trustBody: string;
  storyLink: string;
  missionLink: string;
  noticeTitle: string;
  noticeBody: string;
  membershipLabel: string;
  membershipTitle: string;
  plans: readonly [string, string, string, string][];
  comparePlans: string;
  finalLabel: string;
  finalTitle: string;
  finalBody: string;
};

const TRACK_META = {
  RED: ["/curriculum/red", "border-red-500/40 bg-red-500/10"],
  WHITE: ["/curriculum/white", "border-white/30 bg-white/5"],
  BLUE: ["/curriculum/blue", "border-blue-500/40 bg-blue-500/10"],
  GREEN: ["/curriculum/green", "border-green-500/40 bg-green-500/10"],
  GOLD: ["/curriculum/gold", "border-yellow-500/40 bg-yellow-500/10"],
  PURPLE: ["/curriculum/purple", "border-purple-500/40 bg-purple-500/10"],
  ORANGE: ["/curriculum/orange", "border-orange-500/40 bg-orange-500/10"],
  BLACK: ["/curriculum/black", "border-slate-500/40 bg-slate-500/10"],
} as const;

function tracks(entries: Record<HomeMarketingTrack["code"], [string, string]>): HomeMarketingTrack[] {
  return (Object.keys(TRACK_META) as HomeMarketingTrack["code"][]).map((code) => ({
    code,
    title: entries[code][0],
    body: entries[code][1],
    href: TRACK_META[code][0],
    className: TRACK_META[code][1],
  }));
}

const en: HomeMarketingCopy = {
  heroEyebrow: "FROM FINANCIAL LITERACY TO FINANCIAL INTELLIGENCE",
  heroTitle: "Financial Literacy Is Only the Beginning.",
  heroBody: "Build the financial intelligence to make better decisions about money, investing, business, taxes, real estate, law, ownership, sales, and leadership.",
  startFree: "Start Free",
  takeAssessment: "Take the Financial Intelligence Assessment",
  freeAccessNote: "Explore the first three lessons of Level 1 in each curriculum color without a paid membership.",
  whyLabel: "WHY EDUNANCIAL EXISTS",
  whyTitle: "Most people are taught how to earn money. Far fewer are taught how to understand it.",
  whyBody: "Investing, taxes, business ownership, contracts, real estate, sales, leadership, risk, and building assets all affect financial outcomes. Edunancial brings those disciplines together so learning can progress toward informed action.",
  barriers: [
    ["I don't know how.", "Financial decisions can feel inaccessible when nobody has shown you how the pieces work."],
    ["No one taught me.", "Most people are taught how to earn money. Far fewer are taught how to invest it, protect it, build assets, or understand ownership."],
    ["The system feels stacked against me.", "Financial intelligence starts by understanding the rules, choices, risks, and opportunities well enough to make informed decisions."],
  ],
  colorLabel: "THE EDUNANCIAL COLOR SYSTEM",
  colorTitle: "Eight disciplines. One objective: financial intelligence.",
  colorBody: "Financial decisions rarely exist in isolation. Learn individual disciplines first, then develop the ability to connect them when evaluating real decisions.",
  explorePathway: "Explore pathway →",
  tracks: tracks({
    RED: ["Real Estate", "Learn how property works as an investment, a business, and a wealth-building asset."],
    WHITE: ["Paper Assets", "Understand stocks, bonds, funds, retirement accounts, and financial markets."],
    BLUE: ["Business", "Move beyond earning income and learn how ownership and entrepreneurship work."],
    GREEN: ["Taxes", "Understand how taxes affect workers, investors, entrepreneurs, and business owners differently."],
    GOLD: ["Investing", "Develop the judgment to evaluate opportunity, risk, return, and long-term strategy."],
    PURPLE: ["Law", "Understand contracts, entities, liability, rights, and the legal decisions surrounding ownership."],
    ORANGE: ["Sales & Marketing", "Learn how businesses attract customers, communicate value, and generate revenue."],
    BLACK: ["Leadership & Executive Management", "Develop the skills needed to lead people, organizations, and growth."],
  }),
  journeyLabel: "A LEARNING JOURNEY, NOT A COURSE LIBRARY",
  journeyTitle: "Learn → Understand → Apply → Measure → Improve",
  journeyBody: "Start with financial literacy. Build competency. Practice applied decision-making. Use tools and scenarios to test what you understand. As Edunancial expands, higher-level pathways are designed to connect education with mentorship, business readiness, and external capital opportunities.",
  journeySteps: ["Financial literacy", "Financial competency", "Applied decision-making", "Financial intelligence"],
  levelLabel: "LEVEL",
  assessmentLabel: "DON'T KNOW WHERE TO START?",
  assessmentTitle: "Find the gaps in your financial knowledge.",
  assessmentBody: "Take the Financial Intelligence Assessment to identify areas where your knowledge appears stronger or weaker and use the result to choose a starting point.",
  assessmentCta: "Take the Assessment",
  trustLabel: "EDUCATION BEFORE PROMOTION",
  trustTitle: "Learn the idea. Test your understanding. Make your own informed decisions.",
  trustBody: "Edunancial is designed to teach concepts, frameworks, and decision-making skills—not to sell you a particular investment. Our objective is to help members understand more of the financial world around them.",
  storyLink: "Read our story →",
  missionLink: "Mission & vision →",
  noticeTitle: "Important educational notice",
  noticeBody: "Edunancial provides educational information and learning tools. Content is not individualized investment, legal, tax, accounting, or other professional advice. Examples and projections are illustrative and do not guarantee results. When a decision requires professional advice, consult an appropriately qualified professional.",
  membershipLabel: "CHOOSE HOW FAR YOU WANT TO GO",
  membershipTitle: "Membership is about progression—not simply more lessons.",
  plans: [
    ["BASIC", "Build Your Foundation", "Levels 1–2", "Move from financial literacy toward financial competency."],
    ["PRO", "Learn to Apply It", "Levels 1–4", "Develop applied reasoning and begin using concepts in more realistic financial and business decisions."],
    ["GOLD", "Build Financial Intelligence", "Levels 1–5", "Advanced strategy, integration, and applied decision-making across Edunancial disciplines."],
  ],
  comparePlans: "Compare Membership Options",
  finalLabel: "START WITH WHAT YOU DON'T KNOW",
  finalTitle: "You don't need to master everything today. You need a place to begin.",
  finalBody: "Explore free lessons or take the assessment and begin building your financial intelligence one decision at a time.",
};

const es: HomeMarketingCopy = {
  heroEyebrow: "DE LA ALFABETIZACIÓN FINANCIERA A LA INTELIGENCIA FINANCIERA",
  heroTitle: "La alfabetización financiera es solo el comienzo.",
  heroBody: "Desarrolla la inteligencia financiera para tomar mejores decisiones sobre dinero, inversiones, negocios, impuestos, bienes raíces, derecho, propiedad, ventas y liderazgo.",
  startFree: "Comenzar gratis",
  takeAssessment: "Realizar la Evaluación de Inteligencia Financiera",
  freeAccessNote: "Explora las primeras tres lecciones del Nivel 1 de cada color curricular sin una membresía paga.",
  whyLabel: "POR QUÉ EXISTE EDUNANCIAL",
  whyTitle: "A la mayoría de las personas se les enseña a ganar dinero. A muchas menos se les enseña a entenderlo.",
  whyBody: "Las inversiones, los impuestos, la propiedad empresarial, los contratos, los bienes raíces, las ventas, el liderazgo, el riesgo y la creación de activos influyen en los resultados financieros. Edunancial reúne estas disciplinas para que el aprendizaje avance hacia una acción informada.",
  barriers: [
    ["No sé cómo hacerlo.", "Las decisiones financieras pueden parecer inaccesibles cuando nadie te ha enseñado cómo funcionan las piezas."],
    ["Nadie me lo enseñó.", "A la mayoría se le enseña a ganar dinero. A muchos menos se les enseña a invertirlo, protegerlo, crear activos o entender la propiedad."],
    ["Siento que el sistema está en mi contra.", "La inteligencia financiera comienza por entender las reglas, opciones, riesgos y oportunidades lo suficiente como para tomar decisiones informadas."],
  ],
  colorLabel: "EL SISTEMA DE COLORES DE EDUNANCIAL",
  colorTitle: "Ocho disciplinas. Un objetivo: inteligencia financiera.",
  colorBody: "Las decisiones financieras rara vez existen de forma aislada. Aprende primero cada disciplina y luego desarrolla la capacidad de conectarlas al evaluar decisiones reales.",
  explorePathway: "Explorar ruta →",
  tracks: tracks({
    RED: ["Bienes Raíces", "Aprende cómo funciona la propiedad como inversión, negocio y activo para crear patrimonio."],
    WHITE: ["Activos Financieros", "Comprende acciones, bonos, fondos, cuentas de retiro y mercados financieros."],
    BLUE: ["Negocios", "Ve más allá de ganar ingresos y aprende cómo funcionan la propiedad y el emprendimiento."],
    GREEN: ["Impuestos", "Comprende cómo los impuestos afectan de manera distinta a trabajadores, inversionistas, emprendedores y dueños de negocios."],
    GOLD: ["Inversión", "Desarrolla el criterio para evaluar oportunidades, riesgo, rendimiento y estrategia a largo plazo."],
    PURPLE: ["Derecho", "Comprende contratos, entidades, responsabilidad, derechos y decisiones legales relacionadas con la propiedad."],
    ORANGE: ["Ventas y Mercadeo", "Aprende cómo los negocios atraen clientes, comunican valor y generan ingresos."],
    BLACK: ["Liderazgo y Dirección Ejecutiva", "Desarrolla las habilidades necesarias para liderar personas, organizaciones y crecimiento."],
  }),
  journeyLabel: "UN RECORRIDO DE APRENDIZAJE, NO UNA BIBLIOTECA DE CURSOS",
  journeyTitle: "Aprender → Comprender → Aplicar → Medir → Mejorar",
  journeyBody: "Comienza con alfabetización financiera. Desarrolla competencia. Practica la toma de decisiones aplicada. Usa herramientas y escenarios para poner a prueba lo que entiendes. A medida que Edunancial se expande, las rutas de niveles superiores están diseñadas para conectar educación, mentoría, preparación empresarial y oportunidades de capital externo.",
  journeySteps: ["Alfabetización financiera", "Competencia financiera", "Toma de decisiones aplicada", "Inteligencia financiera"],
  levelLabel: "NIVEL",
  assessmentLabel: "¿NO SABES POR DÓNDE EMPEZAR?",
  assessmentTitle: "Identifica las brechas en tu conocimiento financiero.",
  assessmentBody: "Realiza la Evaluación de Inteligencia Financiera para identificar áreas en las que tu conocimiento parece más fuerte o más débil y usa el resultado para elegir un punto de partida.",
  assessmentCta: "Realizar la evaluación",
  trustLabel: "EDUCACIÓN ANTES QUE PROMOCIÓN",
  trustTitle: "Aprende la idea. Pon a prueba tu comprensión. Toma tus propias decisiones informadas.",
  trustBody: "Edunancial está diseñado para enseñar conceptos, marcos y habilidades de toma de decisiones, no para venderte una inversión específica. Nuestro objetivo es ayudar a los miembros a comprender mejor el mundo financiero que los rodea.",
  storyLink: "Leer nuestra historia →",
  missionLink: "Misión y visión →",
  noticeTitle: "Aviso educativo importante",
  noticeBody: "Edunancial ofrece información educativa y herramientas de aprendizaje. El contenido no constituye asesoría individualizada de inversión, legal, fiscal, contable ni de otro tipo profesional. Los ejemplos y proyecciones son ilustrativos y no garantizan resultados. Cuando una decisión requiera asesoría profesional, consulta a un profesional debidamente cualificado.",
  membershipLabel: "ELIGE HASTA DÓNDE QUIERES LLEGAR",
  membershipTitle: "La membresía trata de progresión, no simplemente de más lecciones.",
  plans: [
    ["BASIC", "Construye tu base", "Niveles 1–2", "Avanza desde la alfabetización financiera hacia la competencia financiera."],
    ["PRO", "Aprende a aplicarlo", "Niveles 1–4", "Desarrolla razonamiento aplicado y empieza a usar conceptos en decisiones financieras y empresariales más realistas."],
    ["GOLD", "Desarrolla inteligencia financiera", "Niveles 1–5", "Estrategia avanzada, integración y toma de decisiones aplicada en las disciplinas de Edunancial."],
  ],
  comparePlans: "Comparar opciones de membresía",
  finalLabel: "EMPIEZA CON LO QUE NO SABES",
  finalTitle: "No necesitas dominarlo todo hoy. Necesitas un lugar donde comenzar.",
  finalBody: "Explora lecciones gratuitas o realiza la evaluación y comienza a desarrollar tu inteligencia financiera, una decisión a la vez.",
};

const fr: HomeMarketingCopy = {
  heroEyebrow: "DE LA LITTÉRATIE FINANCIÈRE À L’INTELLIGENCE FINANCIÈRE",
  heroTitle: "La littératie financière n’est que le début.",
  heroBody: "Développez l’intelligence financière nécessaire pour prendre de meilleures décisions concernant l’argent, l’investissement, les affaires, la fiscalité, l’immobilier, le droit, la propriété, les ventes et le leadership.",
  startFree: "Commencer gratuitement",
  takeAssessment: "Faire l’évaluation d’intelligence financière",
  freeAccessNote: "Explorez gratuitement les trois premières leçons du Niveau 1 de chaque couleur du programme, sans adhésion payante.",
  whyLabel: "POURQUOI EDUNANCIAL EXISTE",
  whyTitle: "On apprend à la plupart des gens comment gagner de l’argent. Beaucoup moins apprennent à le comprendre.",
  whyBody: "L’investissement, la fiscalité, la propriété d’entreprise, les contrats, l’immobilier, les ventes, le leadership, le risque et la création d’actifs influencent tous les résultats financiers. Edunancial réunit ces disciplines afin que l’apprentissage mène à une action éclairée.",
  barriers: [
    ["Je ne sais pas comment faire.", "Les décisions financières peuvent sembler inaccessibles lorsque personne ne vous a montré comment les éléments s’articulent."],
    ["Personne ne me l’a enseigné.", "On apprend à la plupart des gens à gagner de l’argent. Beaucoup moins apprennent à l’investir, le protéger, créer des actifs ou comprendre la propriété."],
    ["J’ai l’impression que le système est contre moi.", "L’intelligence financière commence par une compréhension suffisante des règles, des choix, des risques et des occasions pour prendre des décisions éclairées."],
  ],
  colorLabel: "LE SYSTÈME DE COULEURS EDUNANCIAL",
  colorTitle: "Huit disciplines. Un objectif : l’intelligence financière.",
  colorBody: "Les décisions financières existent rarement de manière isolée. Apprenez d’abord chaque discipline, puis développez la capacité de les relier lorsque vous évaluez des décisions réelles.",
  explorePathway: "Explorer le parcours →",
  tracks: tracks({
    RED: ["Immobilier", "Apprenez comment la propriété fonctionne comme investissement, entreprise et actif de création de patrimoine."],
    WHITE: ["Actifs financiers", "Comprenez les actions, obligations, fonds, comptes de retraite et marchés financiers."],
    BLUE: ["Affaires", "Allez au-delà du revenu et apprenez comment fonctionnent la propriété et l’entrepreneuriat."],
    GREEN: ["Fiscalité", "Comprenez comment les impôts touchent différemment les travailleurs, investisseurs, entrepreneurs et propriétaires d’entreprise."],
    GOLD: ["Investissement", "Développez le jugement nécessaire pour évaluer les occasions, les risques, les rendements et la stratégie à long terme."],
    PURPLE: ["Droit", "Comprenez les contrats, les entités, la responsabilité, les droits et les décisions juridiques entourant la propriété."],
    ORANGE: ["Ventes et marketing", "Apprenez comment les entreprises attirent des clients, communiquent leur valeur et génèrent des revenus."],
    BLACK: ["Leadership et direction générale", "Développez les compétences nécessaires pour diriger des personnes, des organisations et la croissance."],
  }),
  journeyLabel: "UN PARCOURS D’APPRENTISSAGE, PAS UNE BIBLIOTHÈQUE DE COURS",
  journeyTitle: "Apprendre → Comprendre → Appliquer → Mesurer → Améliorer",
  journeyBody: "Commencez par la littératie financière. Développez vos compétences. Exercez-vous à prendre des décisions appliquées. Utilisez des outils et des scénarios pour vérifier ce que vous comprenez. À mesure qu’Edunancial se développe, les parcours avancés sont conçus pour relier l’éducation au mentorat, à la préparation entrepreneuriale et aux possibilités de financement externe.",
  journeySteps: ["Littératie financière", "Compétence financière", "Prise de décision appliquée", "Intelligence financière"],
  levelLabel: "NIVEAU",
  assessmentLabel: "VOUS NE SAVEZ PAS PAR OÙ COMMENCER ?",
  assessmentTitle: "Repérez les lacunes dans vos connaissances financières.",
  assessmentBody: "Faites l’évaluation d’intelligence financière pour repérer les domaines où vos connaissances semblent plus fortes ou plus faibles et utilisez le résultat pour choisir un point de départ.",
  assessmentCta: "Faire l’évaluation",
  trustLabel: "L’ÉDUCATION AVANT LA PROMOTION",
  trustTitle: "Apprenez l’idée. Testez votre compréhension. Prenez vos propres décisions éclairées.",
  trustBody: "Edunancial est conçu pour enseigner des concepts, des cadres et des compétences de prise de décision, et non pour vous vendre un investissement particulier. Notre objectif est d’aider les membres à mieux comprendre le monde financier qui les entoure.",
  storyLink: "Lire notre histoire →",
  missionLink: "Mission et vision →",
  noticeTitle: "Avis éducatif important",
  noticeBody: "Edunancial fournit de l’information éducative et des outils d’apprentissage. Le contenu ne constitue pas un conseil personnalisé en placement, en droit, en fiscalité, en comptabilité ou dans un autre domaine professionnel. Les exemples et projections sont illustratifs et ne garantissent aucun résultat. Lorsqu’une décision exige un avis professionnel, consultez un professionnel dûment qualifié.",
  membershipLabel: "CHOISISSEZ JUSQU’OÙ VOUS VOULEZ ALLER",
  membershipTitle: "L’adhésion concerne la progression, pas simplement davantage de leçons.",
  plans: [
    ["BASIC", "Construisez vos fondations", "Niveaux 1–2", "Passez de la littératie financière à la compétence financière."],
    ["PRO", "Apprenez à l’appliquer", "Niveaux 1–4", "Développez votre raisonnement appliqué et commencez à utiliser les concepts dans des décisions financières et d’affaires plus réalistes."],
    ["GOLD", "Développez votre intelligence financière", "Niveaux 1–5", "Stratégie avancée, intégration et prise de décision appliquée dans les disciplines Edunancial."],
  ],
  comparePlans: "Comparer les options d’adhésion",
  finalLabel: "COMMENCEZ PAR CE QUE VOUS NE SAVEZ PAS",
  finalTitle: "Vous n’avez pas besoin de tout maîtriser aujourd’hui. Vous avez besoin d’un point de départ.",
  finalBody: "Explorez les leçons gratuites ou faites l’évaluation et commencez à développer votre intelligence financière, une décision à la fois.",
};

const ptBR: HomeMarketingCopy = {
  heroEyebrow: "DA EDUCAÇÃO FINANCEIRA À INTELIGÊNCIA FINANCEIRA",
  heroTitle: "Educação financeira é apenas o começo.",
  heroBody: "Desenvolva a inteligência financeira para tomar melhores decisões sobre dinheiro, investimentos, negócios, impostos, imóveis, direito, propriedade, vendas e liderança.",
  startFree: "Começar grátis",
  takeAssessment: "Fazer a Avaliação de Inteligência Financeira",
  freeAccessNote: "Explore gratuitamente as três primeiras lições do Nível 1 de cada cor curricular, sem assinatura paga.",
  whyLabel: "POR QUE A EDUNANCIAL EXISTE",
  whyTitle: "A maioria das pessoas aprende a ganhar dinheiro. Muito menos pessoas aprendem a entendê-lo.",
  whyBody: "Investimentos, impostos, propriedade empresarial, contratos, imóveis, vendas, liderança, risco e construção de ativos influenciam os resultados financeiros. A Edunancial reúne essas disciplinas para que o aprendizado avance em direção a ações informadas.",
  barriers: [
    ["Eu não sei como.", "Decisões financeiras podem parecer inacessíveis quando ninguém mostrou como as peças funcionam juntas."],
    ["Ninguém me ensinou.", "A maioria aprende a ganhar dinheiro. Muito menos pessoas aprendem a investir, proteger, construir ativos ou entender propriedade."],
    ["Parece que o sistema está contra mim.", "A inteligência financeira começa pela compreensão das regras, escolhas, riscos e oportunidades em nível suficiente para tomar decisões informadas."],
  ],
  colorLabel: "O SISTEMA DE CORES DA EDUNANCIAL",
  colorTitle: "Oito disciplinas. Um objetivo: inteligência financeira.",
  colorBody: "Decisões financeiras raramente existem isoladamente. Aprenda primeiro cada disciplina e depois desenvolva a capacidade de conectá-las ao avaliar decisões reais.",
  explorePathway: "Explorar trilha →",
  tracks: tracks({
    RED: ["Imóveis", "Aprenda como a propriedade funciona como investimento, negócio e ativo de construção de patrimônio."],
    WHITE: ["Ativos Financeiros", "Entenda ações, títulos, fundos, contas de aposentadoria e mercados financeiros."],
    BLUE: ["Negócios", "Vá além de ganhar renda e aprenda como funcionam a propriedade e o empreendedorismo."],
    GREEN: ["Impostos", "Entenda como os impostos afetam de forma diferente trabalhadores, investidores, empreendedores e empresários."],
    GOLD: ["Investimentos", "Desenvolva o julgamento para avaliar oportunidades, risco, retorno e estratégia de longo prazo."],
    PURPLE: ["Direito", "Entenda contratos, entidades, responsabilidade, direitos e decisões jurídicas relacionadas à propriedade."],
    ORANGE: ["Vendas e Marketing", "Aprenda como empresas atraem clientes, comunicam valor e geram receita."],
    BLACK: ["Liderança e Gestão Executiva", "Desenvolva as habilidades necessárias para liderar pessoas, organizações e crescimento."],
  }),
  journeyLabel: "UMA JORNADA DE APRENDIZADO, NÃO UMA BIBLIOTECA DE CURSOS",
  journeyTitle: "Aprender → Entender → Aplicar → Medir → Melhorar",
  journeyBody: "Comece com educação financeira. Desenvolva competência. Pratique decisões aplicadas. Use ferramentas e cenários para testar o que você entende. À medida que a Edunancial se expande, as trilhas de níveis mais altos são projetadas para conectar educação, mentoria, preparação empresarial e oportunidades de capital externo.",
  journeySteps: ["Educação financeira", "Competência financeira", "Tomada de decisão aplicada", "Inteligência financeira"],
  levelLabel: "NÍVEL",
  assessmentLabel: "NÃO SABE POR ONDE COMEÇAR?",
  assessmentTitle: "Encontre as lacunas no seu conhecimento financeiro.",
  assessmentBody: "Faça a Avaliação de Inteligência Financeira para identificar áreas em que seu conhecimento parece mais forte ou mais fraco e use o resultado para escolher um ponto de partida.",
  assessmentCta: "Fazer a avaliação",
  trustLabel: "EDUCAÇÃO ANTES DE PROMOÇÃO",
  trustTitle: "Aprenda a ideia. Teste sua compreensão. Tome suas próprias decisões informadas.",
  trustBody: "A Edunancial foi projetada para ensinar conceitos, estruturas e habilidades de tomada de decisão, não para vender um investimento específico. Nosso objetivo é ajudar os membros a entender melhor o mundo financeiro ao seu redor.",
  storyLink: "Leia nossa história →",
  missionLink: "Missão e visão →",
  noticeTitle: "Aviso educacional importante",
  noticeBody: "A Edunancial fornece informações educacionais e ferramentas de aprendizagem. O conteúdo não constitui aconselhamento individualizado de investimento, jurídico, tributário, contábil ou outro aconselhamento profissional. Exemplos e projeções são ilustrativos e não garantem resultados. Quando uma decisão exigir orientação profissional, consulte um profissional devidamente qualificado.",
  membershipLabel: "ESCOLHA ATÉ ONDE VOCÊ QUER IR",
  membershipTitle: "A assinatura é sobre progressão, não simplesmente mais lições.",
  plans: [
    ["BASIC", "Construa sua base", "Níveis 1–2", "Avance da educação financeira para a competência financeira."],
    ["PRO", "Aprenda a aplicar", "Níveis 1–4", "Desenvolva raciocínio aplicado e comece a usar conceitos em decisões financeiras e empresariais mais realistas."],
    ["GOLD", "Desenvolva inteligência financeira", "Níveis 1–5", "Estratégia avançada, integração e tomada de decisão aplicada em todas as disciplinas da Edunancial."],
  ],
  comparePlans: "Comparar opções de assinatura",
  finalLabel: "COMECE PELO QUE VOCÊ NÃO SABE",
  finalTitle: "Você não precisa dominar tudo hoje. Precisa de um lugar para começar.",
  finalBody: "Explore lições gratuitas ou faça a avaliação e comece a desenvolver sua inteligência financeira, uma decisão de cada vez.",
};

const ptPT: HomeMarketingCopy = {
  ...ptBR,
  heroEyebrow: "DA LITERACIA FINANCEIRA À INTELIGÊNCIA FINANCEIRA",
  heroTitle: "A literacia financeira é apenas o começo.",
  heroBody: "Desenvolva a inteligência financeira para tomar melhores decisões sobre dinheiro, investimentos, negócios, impostos, imobiliário, direito, propriedade, vendas e liderança.",
  freeAccessNote: "Explore gratuitamente as três primeiras lições do Nível 1 de cada cor curricular, sem adesão paga.",
  whyTitle: "A maioria das pessoas aprende a ganhar dinheiro. Muito menos pessoas aprendem a compreendê-lo.",
  journeySteps: ["Literacia financeira", "Competência financeira", "Tomada de decisão aplicada", "Inteligência financeira"],
  plans: [
    ["BASIC", "Construa a sua base", "Níveis 1–2", "Avance da literacia financeira para a competência financeira."],
    ["PRO", "Aprenda a aplicar", "Níveis 1–4", "Desenvolva raciocínio aplicado e comece a usar conceitos em decisões financeiras e empresariais mais realistas."],
    ["GOLD", "Desenvolva inteligência financeira", "Níveis 1–5", "Estratégia avançada, integração e tomada de decisão aplicada nas disciplinas Edunancial."],
  ],
  comparePlans: "Comparar opções de adesão",
};

const de: HomeMarketingCopy = {
  heroEyebrow: "VON FINANZBILDUNG ZU FINANZIELLER INTELLIGENZ",
  heroTitle: "Finanzbildung ist erst der Anfang.",
  heroBody: "Entwickeln Sie finanzielle Intelligenz, um bessere Entscheidungen über Geld, Investitionen, Unternehmen, Steuern, Immobilien, Recht, Eigentum, Vertrieb und Führung zu treffen.",
  startFree: "Kostenlos starten",
  takeAssessment: "Finanzintelligenz-Assessment durchführen",
  freeAccessNote: "Entdecken Sie die ersten drei Lektionen von Level 1 jeder Curriculum-Farbe kostenlos und ohne kostenpflichtige Mitgliedschaft.",
  whyLabel: "WARUM EDUNANCIAL EXISTIERT",
  whyTitle: "Den meisten Menschen wird beigebracht, wie man Geld verdient. Viel weniger lernen, wie man es versteht.",
  whyBody: "Investieren, Steuern, Unternehmenseigentum, Verträge, Immobilien, Vertrieb, Führung, Risiko und Vermögensaufbau beeinflussen finanzielle Ergebnisse. Edunancial verbindet diese Disziplinen, damit Lernen zu informierten Handlungen führt.",
  barriers: [
    ["Ich weiß nicht, wie.", "Finanzielle Entscheidungen können unzugänglich wirken, wenn niemand erklärt hat, wie die einzelnen Teile zusammenwirken."],
    ["Niemand hat es mir beigebracht.", "Die meisten lernen, Geld zu verdienen. Viel weniger lernen, es zu investieren, zu schützen, Vermögenswerte aufzubauen oder Eigentum zu verstehen."],
    ["Das System scheint gegen mich zu sein.", "Finanzielle Intelligenz beginnt damit, Regeln, Wahlmöglichkeiten, Risiken und Chancen gut genug zu verstehen, um informierte Entscheidungen zu treffen."],
  ],
  colorLabel: "DAS EDUNANCIAL-FARBSYSTEM",
  colorTitle: "Acht Disziplinen. Ein Ziel: finanzielle Intelligenz.",
  colorBody: "Finanzielle Entscheidungen stehen selten für sich allein. Lernen Sie zunächst die einzelnen Disziplinen und entwickeln Sie dann die Fähigkeit, sie bei realen Entscheidungen miteinander zu verbinden.",
  explorePathway: "Lernpfad erkunden →",
  tracks: tracks({
    RED: ["Immobilien", "Lernen Sie, wie Immobilien als Investition, Unternehmen und Vermögensaufbau funktionieren."],
    WHITE: ["Finanzanlagen", "Verstehen Sie Aktien, Anleihen, Fonds, Altersvorsorgekonten und Finanzmärkte."],
    BLUE: ["Unternehmen", "Gehen Sie über Einkommen hinaus und lernen Sie, wie Eigentum und Unternehmertum funktionieren."],
    GREEN: ["Steuern", "Verstehen Sie, wie Steuern Arbeitnehmer, Investoren, Unternehmer und Geschäftsinhaber unterschiedlich betreffen."],
    GOLD: ["Investieren", "Entwickeln Sie Urteilsvermögen, um Chancen, Risiken, Renditen und langfristige Strategien zu bewerten."],
    PURPLE: ["Recht", "Verstehen Sie Verträge, Rechtsformen, Haftung, Rechte und rechtliche Entscheidungen rund um Eigentum."],
    ORANGE: ["Vertrieb & Marketing", "Lernen Sie, wie Unternehmen Kunden gewinnen, Wert vermitteln und Umsatz erzeugen."],
    BLACK: ["Führung & Geschäftsleitung", "Entwickeln Sie die Fähigkeiten, Menschen, Organisationen und Wachstum zu führen."],
  }),
  journeyLabel: "EINE LERNREISE, KEINE KURSBIBLIOTHEK",
  journeyTitle: "Lernen → Verstehen → Anwenden → Messen → Verbessern",
  journeyBody: "Beginnen Sie mit Finanzbildung. Bauen Sie Kompetenz auf. Üben Sie angewandte Entscheidungsfindung. Nutzen Sie Werkzeuge und Szenarien, um Ihr Verständnis zu testen. Mit der Expansion von Edunancial sollen höhere Lernstufen Bildung mit Mentoring, Geschäftsreife und externen Kapitalmöglichkeiten verbinden.",
  journeySteps: ["Finanzbildung", "Finanzkompetenz", "Angewandte Entscheidungsfindung", "Finanzielle Intelligenz"],
  levelLabel: "LEVEL",
  assessmentLabel: "SIE WISSEN NICHT, WO SIE ANFANGEN SOLLEN?",
  assessmentTitle: "Finden Sie die Lücken in Ihrem Finanzwissen.",
  assessmentBody: "Nutzen Sie das Finanzintelligenz-Assessment, um Bereiche zu erkennen, in denen Ihr Wissen stärker oder schwächer ist, und wählen Sie damit einen sinnvollen Startpunkt.",
  assessmentCta: "Assessment durchführen",
  trustLabel: "BILDUNG VOR WERBUNG",
  trustTitle: "Lernen Sie die Idee. Testen Sie Ihr Verständnis. Treffen Sie Ihre eigenen informierten Entscheidungen.",
  trustBody: "Edunancial vermittelt Konzepte, Denkmodelle und Entscheidungsfähigkeiten – nicht den Verkauf einer bestimmten Investition. Unser Ziel ist, Mitgliedern zu helfen, die Finanzwelt um sie herum besser zu verstehen.",
  storyLink: "Unsere Geschichte lesen →",
  missionLink: "Mission & Vision →",
  noticeTitle: "Wichtiger Bildungshinweis",
  noticeBody: "Edunancial stellt Bildungsinformationen und Lernwerkzeuge bereit. Inhalte sind keine individuelle Anlage-, Rechts-, Steuer-, Buchhaltungs- oder sonstige professionelle Beratung. Beispiele und Projektionen dienen nur der Veranschaulichung und garantieren keine Ergebnisse. Wenn eine Entscheidung professionelle Beratung erfordert, wenden Sie sich an eine entsprechend qualifizierte Fachperson.",
  membershipLabel: "ENTSCHEIDEN SIE, WIE WEIT SIE GEHEN MÖCHTEN",
  membershipTitle: "Bei der Mitgliedschaft geht es um Fortschritt – nicht einfach um mehr Lektionen.",
  plans: [
    ["BASIC", "Grundlage aufbauen", "Level 1–2", "Entwickeln Sie sich von Finanzbildung zu Finanzkompetenz."],
    ["PRO", "Anwendung lernen", "Level 1–4", "Entwickeln Sie angewandtes Denken und nutzen Sie Konzepte in realistischeren Finanz- und Geschäftsentscheidungen."],
    ["GOLD", "Finanzielle Intelligenz aufbauen", "Level 1–5", "Fortgeschrittene Strategie, Integration und angewandte Entscheidungsfindung über alle Edunancial-Disziplinen hinweg."],
  ],
  comparePlans: "Mitgliedschaften vergleichen",
  finalLabel: "BEGINNEN SIE MIT DEM, WAS SIE NOCH NICHT WISSEN",
  finalTitle: "Sie müssen heute nicht alles beherrschen. Sie brauchen einen Ort, an dem Sie beginnen können.",
  finalBody: "Entdecken Sie kostenlose Lektionen oder machen Sie das Assessment und entwickeln Sie Ihre finanzielle Intelligenz Schritt für Schritt.",
};

const it: HomeMarketingCopy = {
  heroEyebrow: "DALL’ALFABETIZZAZIONE FINANZIARIA ALL’INTELLIGENZA FINANZIARIA",
  heroTitle: "L’alfabetizzazione finanziaria è solo l’inizio.",
  heroBody: "Sviluppa l’intelligenza finanziaria per prendere decisioni migliori su denaro, investimenti, impresa, tasse, immobili, diritto, proprietà, vendite e leadership.",
  startFree: "Inizia gratis",
  takeAssessment: "Fai la valutazione di intelligenza finanziaria",
  freeAccessNote: "Esplora gratuitamente le prime tre lezioni del Livello 1 di ogni colore curricolare, senza iscrizione a pagamento.",
  whyLabel: "PERCHÉ ESISTE EDUNANCIAL",
  whyTitle: "Alla maggior parte delle persone viene insegnato come guadagnare denaro. A molte meno viene insegnato come comprenderlo.",
  whyBody: "Investimenti, tasse, proprietà d’impresa, contratti, immobili, vendite, leadership, rischio e costruzione di asset influenzano i risultati finanziari. Edunancial riunisce queste discipline affinché l’apprendimento conduca ad azioni informate.",
  barriers: [
    ["Non so come fare.", "Le decisioni finanziarie possono sembrare inaccessibili quando nessuno ti ha mostrato come funzionano insieme i vari elementi."],
    ["Nessuno me l’ha insegnato.", "Alla maggior parte delle persone viene insegnato a guadagnare denaro. A molte meno come investirlo, proteggerlo, creare asset o comprendere la proprietà."],
    ["Sembra che il sistema sia contro di me.", "L’intelligenza finanziaria inizia dalla comprensione di regole, scelte, rischi e opportunità sufficiente per prendere decisioni informate."],
  ],
  colorLabel: "IL SISTEMA DI COLORI EDUNANCIAL",
  colorTitle: "Otto discipline. Un obiettivo: intelligenza finanziaria.",
  colorBody: "Le decisioni finanziarie raramente esistono in isolamento. Impara prima le singole discipline, poi sviluppa la capacità di collegarle quando valuti decisioni reali.",
  explorePathway: "Esplora il percorso →",
  tracks: tracks({
    RED: ["Immobiliare", "Impara come la proprietà funziona come investimento, impresa e asset per costruire patrimonio."],
    WHITE: ["Asset finanziari", "Comprendi azioni, obbligazioni, fondi, conti pensionistici e mercati finanziari."],
    BLUE: ["Impresa", "Vai oltre il reddito e impara come funzionano proprietà e imprenditorialità."],
    GREEN: ["Tasse", "Comprendi come le imposte incidono in modo diverso su lavoratori, investitori, imprenditori e titolari d’impresa."],
    GOLD: ["Investimenti", "Sviluppa il giudizio per valutare opportunità, rischio, rendimento e strategia di lungo periodo."],
    PURPLE: ["Diritto", "Comprendi contratti, entità, responsabilità, diritti e decisioni legali legate alla proprietà."],
    ORANGE: ["Vendite e Marketing", "Impara come le imprese attirano clienti, comunicano valore e generano ricavi."],
    BLACK: ["Leadership e Direzione Esecutiva", "Sviluppa le competenze necessarie per guidare persone, organizzazioni e crescita."],
  }),
  journeyLabel: "UN PERCORSO DI APPRENDIMENTO, NON UNA BIBLIOTECA DI CORSI",
  journeyTitle: "Impara → Comprendi → Applica → Misura → Migliora",
  journeyBody: "Inizia con l’alfabetizzazione finanziaria. Sviluppa competenza. Esercitati nella presa di decisioni applicata. Usa strumenti e scenari per verificare ciò che comprendi. Con l’espansione di Edunancial, i livelli superiori sono progettati per collegare educazione, mentorship, preparazione imprenditoriale e opportunità di capitale esterno.",
  journeySteps: ["Alfabetizzazione finanziaria", "Competenza finanziaria", "Presa di decisione applicata", "Intelligenza finanziaria"],
  levelLabel: "LIVELLO",
  assessmentLabel: "NON SAI DA DOVE INIZIARE?",
  assessmentTitle: "Individua le lacune nelle tue conoscenze finanziarie.",
  assessmentBody: "Fai la Valutazione di Intelligenza Finanziaria per individuare le aree in cui le tue conoscenze sembrano più forti o più deboli e usa il risultato per scegliere un punto di partenza.",
  assessmentCta: "Fai la valutazione",
  trustLabel: "EDUCAZIONE PRIMA DELLA PROMOZIONE",
  trustTitle: "Impara il concetto. Verifica la comprensione. Prendi decisioni informate in autonomia.",
  trustBody: "Edunancial è progettata per insegnare concetti, modelli e capacità decisionali, non per venderti un investimento specifico. Il nostro obiettivo è aiutare i membri a comprendere meglio il mondo finanziario che li circonda.",
  storyLink: "Leggi la nostra storia →",
  missionLink: "Missione e visione →",
  noticeTitle: "Importante avviso educativo",
  noticeBody: "Edunancial fornisce informazioni educative e strumenti di apprendimento. I contenuti non costituiscono consulenza individualizzata in materia di investimenti, diritto, fisco, contabilità o altra consulenza professionale. Esempi e proiezioni sono illustrativi e non garantiscono risultati. Quando una decisione richiede consulenza professionale, rivolgiti a un professionista adeguatamente qualificato.",
  membershipLabel: "SCEGLI FIN DOVE VUOI ARRIVARE",
  membershipTitle: "L’iscrizione riguarda la progressione, non semplicemente più lezioni.",
  plans: [
    ["BASIC", "Costruisci le fondamenta", "Livelli 1–2", "Passa dall’alfabetizzazione finanziaria alla competenza finanziaria."],
    ["PRO", "Impara ad applicare", "Livelli 1–4", "Sviluppa il ragionamento applicato e inizia a usare i concetti in decisioni finanziarie e aziendali più realistiche."],
    ["GOLD", "Costruisci intelligenza finanziaria", "Livelli 1–5", "Strategia avanzata, integrazione e decisioni applicate nelle discipline Edunancial."],
  ],
  comparePlans: "Confronta le opzioni di iscrizione",
  finalLabel: "INIZIA DA CIÒ CHE NON SAI",
  finalTitle: "Non devi padroneggiare tutto oggi. Ti serve un punto da cui iniziare.",
  finalBody: "Esplora le lezioni gratuite oppure fai la valutazione e inizia a costruire la tua intelligenza finanziaria, una decisione alla volta.",
};

const nl: HomeMarketingCopy = {
  heroEyebrow: "VAN FINANCIËLE GELETTERDHEID NAAR FINANCIËLE INTELLIGENTIE",
  heroTitle: "Financiële geletterdheid is pas het begin.",
  heroBody: "Bouw financiële intelligentie op om betere beslissingen te nemen over geld, beleggen, ondernemen, belastingen, vastgoed, recht, eigendom, verkoop en leiderschap.",
  startFree: "Gratis beginnen",
  takeAssessment: "Doe de financiële-intelligentietest",
  freeAccessNote: "Bekijk gratis de eerste drie lessen van Niveau 1 van elke curriculumkleur, zonder betaald lidmaatschap.",
  whyLabel: "WAAROM EDUNANCIAL BESTAAT",
  whyTitle: "De meeste mensen leren hoe ze geld kunnen verdienen. Veel minder mensen leren hoe ze het moeten begrijpen.",
  whyBody: "Beleggen, belastingen, bedrijfseigendom, contracten, vastgoed, verkoop, leiderschap, risico en vermogensopbouw beïnvloeden financiële resultaten. Edunancial brengt deze disciplines samen zodat leren kan leiden tot geïnformeerde actie.",
  barriers: [
    ["Ik weet niet hoe.", "Financiële beslissingen kunnen ontoegankelijk voelen wanneer niemand heeft laten zien hoe de onderdelen samenhangen."],
    ["Niemand heeft het me geleerd.", "De meeste mensen leren geld verdienen. Veel minder leren hoe ze het investeren, beschermen, activa opbouwen of eigendom begrijpen."],
    ["Het voelt alsof het systeem tegen me werkt.", "Financiële intelligentie begint met voldoende begrip van regels, keuzes, risico’s en kansen om geïnformeerde beslissingen te nemen."],
  ],
  colorLabel: "HET EDUNANCIAL-KLEURENSYSTEEM",
  colorTitle: "Acht disciplines. Eén doel: financiële intelligentie.",
  colorBody: "Financiële beslissingen staan zelden op zichzelf. Leer eerst de afzonderlijke disciplines en ontwikkel daarna het vermogen om ze te verbinden bij echte beslissingen.",
  explorePathway: "Leerpad bekijken →",
  tracks: tracks({
    RED: ["Vastgoed", "Leer hoe vastgoed werkt als investering, onderneming en vermogensopbouwend bezit."],
    WHITE: ["Financiële activa", "Begrijp aandelen, obligaties, fondsen, pensioenrekeningen en financiële markten."],
    BLUE: ["Ondernemen", "Ga verder dan inkomen verdienen en leer hoe eigendom en ondernemerschap werken."],
    GREEN: ["Belastingen", "Begrijp hoe belastingen werknemers, beleggers, ondernemers en bedrijfseigenaren verschillend raken."],
    GOLD: ["Beleggen", "Ontwikkel het oordeel om kansen, risico, rendement en langetermijnstrategie te beoordelen."],
    PURPLE: ["Recht", "Begrijp contracten, rechtsvormen, aansprakelijkheid, rechten en juridische beslissingen rond eigendom."],
    ORANGE: ["Verkoop & Marketing", "Leer hoe bedrijven klanten aantrekken, waarde communiceren en omzet genereren."],
    BLACK: ["Leiderschap & Directie", "Ontwikkel de vaardigheden om mensen, organisaties en groei te leiden."],
  }),
  journeyLabel: "EEN LEERREIS, GEEN CURSUSBIBLIOTHEEK",
  journeyTitle: "Leren → Begrijpen → Toepassen → Meten → Verbeteren",
  journeyBody: "Begin met financiële geletterdheid. Bouw competentie op. Oefen toegepaste besluitvorming. Gebruik hulpmiddelen en scenario’s om te testen wat je begrijpt. Naarmate Edunancial uitbreidt, zijn hogere niveaus ontworpen om onderwijs te verbinden met mentoring, bedrijfsrijpheid en externe kapitaalmogelijkheden.",
  journeySteps: ["Financiële geletterdheid", "Financiële competentie", "Toegepaste besluitvorming", "Financiële intelligentie"],
  levelLabel: "NIVEAU",
  assessmentLabel: "WEET JE NIET WAAR JE MOET BEGINNEN?",
  assessmentTitle: "Vind de gaten in je financiële kennis.",
  assessmentBody: "Doe de financiële-intelligentietest om te zien waar je kennis sterker of zwakker lijkt en gebruik het resultaat om een startpunt te kiezen.",
  assessmentCta: "Doe de test",
  trustLabel: "ONDERWIJS VÓÓR PROMOTIE",
  trustTitle: "Leer het idee. Test je begrip. Neem je eigen geïnformeerde beslissingen.",
  trustBody: "Edunancial is ontworpen om concepten, kaders en besluitvormingsvaardigheden te leren, niet om je een specifieke investering te verkopen. Ons doel is leden te helpen meer te begrijpen van de financiële wereld om hen heen.",
  storyLink: "Lees ons verhaal →",
  missionLink: "Missie & visie →",
  noticeTitle: "Belangrijke educatieve mededeling",
  noticeBody: "Edunancial biedt educatieve informatie en leermiddelen. De inhoud is geen individueel beleggings-, juridisch, fiscaal, boekhoudkundig of ander professioneel advies. Voorbeelden en projecties zijn illustratief en bieden geen garantie op resultaten. Raadpleeg een passend gekwalificeerde professional wanneer een beslissing professioneel advies vereist.",
  membershipLabel: "KIES HOE VER JE WILT GAAN",
  membershipTitle: "Lidmaatschap draait om vooruitgang, niet simpelweg om meer lessen.",
  plans: [
    ["BASIC", "Bouw je basis", "Niveaus 1–2", "Ga van financiële geletterdheid naar financiële competentie."],
    ["PRO", "Leer het toepassen", "Niveaus 1–4", "Ontwikkel toegepast redeneren en gebruik concepten in realistischere financiële en zakelijke beslissingen."],
    ["GOLD", "Bouw financiële intelligentie", "Niveaus 1–5", "Geavanceerde strategie, integratie en toegepaste besluitvorming in alle Edunancial-disciplines."],
  ],
  comparePlans: "Lidmaatschappen vergelijken",
  finalLabel: "BEGIN MET WAT JE NOG NIET WEET",
  finalTitle: "Je hoeft vandaag niet alles te beheersen. Je hebt een plek nodig om te beginnen.",
  finalBody: "Bekijk gratis lessen of doe de test en begin je financiële intelligentie op te bouwen, één beslissing tegelijk.",
};

export function getHomeMarketingCopy(languageCode: string): HomeMarketingCopy {
  const locale = normalizeLanguageCode(languageCode);
  if (locale === "es-Caribbean" || locale === "es-ES") return es;
  if (locale === "fr-CA" || locale === "fr-FR") return fr;
  if (locale === "pt-BR") return ptBR;
  if (locale === "pt-PT") return ptPT;
  if (locale === "de") return de;
  if (locale === "it") return it;
  if (locale === "nl") return nl;
  return en;
}
