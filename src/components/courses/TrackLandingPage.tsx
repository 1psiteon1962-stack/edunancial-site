import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";

type TrackKey = "red" | "white" | "blue";

type LocaleContent = {
  eyebrow: string;
  title: string;
  overview: string;
  courseNote?: string;
  courses: string[];
  books: string[];
  path: string[];
  comingSoon: string[];
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
};

const TRACK_CONTENT: Record<TrackKey, { en: LocaleContent; es: LocaleContent; fr: LocaleContent }> = {
  red: {
    en: {
      eyebrow: "RED — Real Estate",
      title: "Learn how wealth is built through real estate.",
      overview: "RED helps members move from basic property vocabulary to disciplined real-estate decisions across rentals, tax liens, tax deeds, creative finance, and long-term wealth building.",
      courses: ["Introduction to Real Estate Investing", "Rental Properties: Cash Flow Analysis", "Creative Financing Strategies"],
      books: ["Real-estate vocabulary and cash-flow workbook", "Rental analysis worksheets", "Acquisition and due-diligence checklists"],
      path: ["Build literacy with foundational RED lessons.", "Practice deal analysis and financing scenarios.", "Track progress, complete assessments, and earn certificates."],
      comingSoon: ["Expanded tax-lien and tax-deed scenario labs", "Advanced acquisition templates"],
      primaryCta: { href: "/courses/red-real-estate", label: "View RED Courses" },
      secondaryCta: { href: "/membership", label: "Start Membership" },
    },
    es: {
      eyebrow: "RED — Bienes raíces",
      title: "Aprenda cómo se construye riqueza a través de los bienes raíces.",
      overview: "RED ayuda a los miembros a pasar del vocabulario básico de propiedad a decisiones disciplinadas sobre alquileres, gravámenes fiscales, escrituras fiscales, financiamiento creativo y construcción patrimonial a largo plazo.",
      courseNote: "Los detalles completos de cursos RED en español siguen en preparación. Mientras tanto, esta ruta aclara qué aprender y cuál es el siguiente paso correcto.",
      courses: ["Fundamentos de inversión inmobiliaria", "Análisis de flujo de efectivo para alquileres", "Estrategias de financiamiento creativo"],
      books: ["Cuaderno de vocabulario inmobiliario y flujo de caja", "Hojas de trabajo para análisis de alquileres", "Listas de verificación para adquisición y debida diligencia"],
      path: ["Construya alfabetización con lecciones RED fundamentales.", "Practique análisis de oportunidades y escenarios de financiamiento.", "Siga su progreso, complete evaluaciones y obtenga certificados."],
      comingSoon: ["Laboratorios ampliados sobre gravámenes y escrituras fiscales", "Plantillas avanzadas de adquisición"],
      primaryCta: { href: "/membership", label: "Comenzar membresía" },
      secondaryCta: { href: "/courses", label: "Explorar rutas de aprendizaje" },
    },
    fr: {
      eyebrow: "RED — Immobilier",
      title: "Apprenez comment la richesse se construit grâce à l'immobilier.",
      overview: "RED aide les membres à passer du vocabulaire immobilier de base à des décisions disciplinées en matière de location, de privilèges fiscaux, de titres fiscaux, de financement créatif et de création de richesse à long terme.",
      courses: ["Introduction à l'investissement immobilier", "Propriétés locatives : analyse des flux de trésorerie", "Stratégies de financement créatif"],
      books: ["Cahier de vocabulaire immobilier et de flux de trésorerie", "Feuilles d'analyse locative", "Listes de vérification d'acquisition et de diligence raisonnable"],
      path: ["Développez votre littératie avec des leçons RED fondamentales.", "Exercez-vous à l'analyse d'opportunités et aux scénarios de financement.", "Suivez vos progrès, complétez les évaluations et obtenez des certificats."],
      comingSoon: ["Laboratoires élargis sur les privilèges fiscaux et titres fiscaux", "Modèles avancés d'acquisition"],
      primaryCta: { href: "/courses/red-real-estate", label: "Voir les cours RED" },
      secondaryCta: { href: "/membership", label: "Commencer l'abonnement" },
    },
  },
  white: {
    en: {
      eyebrow: "WHITE — Paper Assets",
      title: "Build confidence in markets, risk, and portfolio decisions.",
      overview: "WHITE turns financial literacy into competency across budgeting, stocks, ETFs, options, retirement accounts, and portfolio discipline.",
      courses: ["Introduction to Financial Assets", "Stocks: Fundamentals & Analysis", "Retirement Accounts: IRA, Roth, 401k"],
      books: ["Asset-allocation workbook", "Budgeting and cash-reserve templates", "Market-research note sheets"],
      path: ["Start with budgeting and asset foundations.", "Practice research, diversification, and risk management.", "Use progress tracking and certificates to reinforce disciplined action."],
      comingSoon: ["More scenario-based options labs", "Expanded portfolio review tools"],
      primaryCta: { href: "/courses/white-paper-assets", label: "View WHITE Courses" },
      secondaryCta: { href: "/membership", label: "Compare Membership" },
    },
    es: {
      eyebrow: "WHITE — Activos financieros",
      title: "Desarrolle confianza en mercados, riesgo y decisiones de portafolio.",
      overview: "WHITE convierte la alfabetización financiera en competencia aplicada sobre presupuesto, acciones, ETF, opciones, cuentas de retiro y disciplina de portafolio.",
      courseNote: "Los detalles completos de cursos WHITE en español aún están en preparación. Esta página muestra la ruta, los recursos y el siguiente paso recomendado.",
      courses: ["Introducción a los activos financieros", "Acciones: fundamentos y análisis", "Cuentas de retiro: IRA, Roth y 401k"],
      books: ["Cuaderno de asignación de activos", "Plantillas de presupuesto y reserva de efectivo", "Hojas para investigación de mercado"],
      path: ["Comience con presupuesto y fundamentos de activos.", "Practique investigación, diversificación y gestión del riesgo.", "Use el seguimiento de progreso y los certificados para reforzar la acción disciplinada."],
      comingSoon: ["Más laboratorios de opciones basados en escenarios", "Herramientas ampliadas de revisión de portafolio"],
      primaryCta: { href: "/membership", label: "Comparar membresía" },
      secondaryCta: { href: "/courses", label: "Explorar rutas de aprendizaje" },
    },
    fr: {
      eyebrow: "WHITE — Actifs financiers",
      title: "Développez votre confiance dans les marchés, le risque et les décisions de portefeuille.",
      overview: "WHITE transforme la littératie financière en compétence appliquée en matière de budget, d'actions, de FNB, d'options, de comptes de retraite et de discipline de portefeuille.",
      courses: ["Introduction aux actifs financiers", "Actions : fondamentaux et analyse", "Comptes de retraite : IRA, Roth et 401k"],
      books: ["Cahier de répartition d'actifs", "Modèles de budget et de réserve de trésorerie", "Feuilles de recherche de marché"],
      path: ["Commencez par le budget et les bases des actifs.", "Exercez-vous à la recherche, à la diversification et à la gestion des risques.", "Utilisez le suivi de progression et les certificats pour renforcer une action disciplinée."],
      comingSoon: ["Davantage de laboratoires d'options fondés sur des scénarios", "Outils élargis de révision de portefeuille"],
      primaryCta: { href: "/courses/white-paper-assets", label: "Voir les cours WHITE" },
      secondaryCta: { href: "/membership", label: "Comparer l'abonnement" },
    },
  },
  blue: {
    en: {
      eyebrow: "BLUE — Business",
      title: "Turn business activity into measurable profit and progress.",
      overview: "BLUE helps members learn entrepreneurship, pricing, profit, KPIs, marketing, and systems so business decisions become disciplined and repeatable.",
      courses: ["Introduction to Business Competency", "KPIs: Running on Data", "Pricing Strategy for Profit"],
      books: ["Business scorecard workbook", "Pricing and margin worksheets", "Operations and leadership planning templates"],
      path: ["Learn the language of revenue, profit, and customer value.", "Practice with KPIs, pricing, and operational systems.", "Turn lessons into decisions you can measure over time."],
      comingSoon: ["Expanded leadership and hiring playbooks", "Advanced business-systems scorecards"],
      primaryCta: { href: "/courses/blue-business", label: "View BLUE Courses" },
      secondaryCta: { href: "/membership", label: "Upgrade Membership" },
    },
    es: {
      eyebrow: "BLUE — Negocios",
      title: "Convierta la actividad empresarial en utilidad y progreso medibles.",
      overview: "BLUE ayuda a los miembros a aprender emprendimiento, precios, utilidad, KPI, marketing y sistemas para que las decisiones de negocio sean disciplinadas y repetibles.",
      courseNote: "Los detalles completos de cursos BLUE en español siguen en preparación. La ruta actual muestra qué aprender ahora y cómo avanzar sin puntos muertos.",
      courses: ["Introducción a la competencia empresarial", "KPI: gestionar con datos", "Estrategia de precios para obtener utilidad"],
      books: ["Cuaderno de indicadores empresariales", "Hojas de trabajo de precios y márgenes", "Plantillas de operaciones y liderazgo"],
      path: ["Aprenda el lenguaje de ingresos, utilidad y valor al cliente.", "Practique con KPI, precios y sistemas operativos.", "Convierta las lecciones en decisiones medibles en el tiempo."],
      comingSoon: ["Guías ampliadas de liderazgo y contratación", "Tableros avanzados de sistemas empresariales"],
      primaryCta: { href: "/membership", label: "Actualizar membresía" },
      secondaryCta: { href: "/courses", label: "Explorar rutas de aprendizaje" },
    },
    fr: {
      eyebrow: "BLUE — Entreprise",
      title: "Transformez l'activité d'entreprise en profit et en progression mesurables.",
      overview: "BLUE aide les membres à apprendre l'entrepreneuriat, la tarification, le profit, les KPI, le marketing et les systèmes afin que les décisions d'affaires deviennent disciplinées et reproductibles.",
      courses: ["Introduction à la compétence d'affaires", "KPI : piloter avec les données", "Stratégie de prix pour le profit"],
      books: ["Cahier de tableau de bord d'entreprise", "Feuilles de calcul des prix et des marges", "Modèles de planification opérationnelle et de leadership"],
      path: ["Apprenez le langage des revenus, du profit et de la valeur client.", "Exercez-vous avec les KPI, la tarification et les systèmes opérationnels.", "Transformez les leçons en décisions que vous pouvez mesurer au fil du temps."],
      comingSoon: ["Guides élargis sur le leadership et le recrutement", "Tableaux de bord avancés des systèmes d'affaires"],
      primaryCta: { href: "/courses/blue-business", label: "Voir les cours BLUE" },
      secondaryCta: { href: "/membership", label: "Améliorer l'abonnement" },
    },
  },
};

function SectionList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <ul className="mt-4 space-y-3 text-slate-300">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </section>
  );
}

function TrackLayout({
  content,
  coursesLabel,
  booksLabel,
  pathLabel,
  comingSoonLabel,
  noteTitle,
}: {
  content: LocaleContent;
  coursesLabel: string;
  booksLabel: string;
  pathLabel: string;
  comingSoonLabel: string;
  noteTitle?: string;
}) {
  return (
    <main className="min-h-screen bg-[#08101f] text-white">
      <section className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">{content.eyebrow}</p>
        <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">{content.title}</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">{content.overview}</p>
        {content.courseNote && noteTitle && (
          <div className="mt-8 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-slate-200">
            <p className="font-semibold text-blue-200">{noteTitle}</p>
            <p className="mt-3 leading-7">{content.courseNote}</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap gap-4">
          <Link href={content.primaryCta.href} className="rounded-xl bg-blue-600 px-6 py-4 font-bold hover:bg-blue-700">
            {content.primaryCta.label}
          </Link>
          <Link href={content.secondaryCta.href} className="rounded-xl border border-white/20 px-6 py-4 font-bold hover:bg-white hover:text-slate-950">
            {content.secondaryCta.label}
          </Link>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <SectionList title={coursesLabel} items={content.courses} />
          <SectionList title={booksLabel} items={content.books} />
          <SectionList title={pathLabel} items={content.path} />
          <SectionList title={comingSoonLabel} items={content.comingSoon} />
        </div>
      </section>
    </main>
  );
}

export default function TrackLandingPage({ track }: { track: TrackKey }) {
  const content = TRACK_CONTENT[track];

  return (
    <BilingualContent
      en={<TrackLayout content={content.en} coursesLabel="Courses" booksLabel="Books & Workbooks" pathLabel="Learning Path" comingSoonLabel="Coming Soon" />}
      es={<TrackLayout content={content.es} coursesLabel="Cursos" booksLabel="Libros y cuadernos" pathLabel="Ruta de aprendizaje" comingSoonLabel="Próximamente" noteTitle="Contenido en español en desarrollo" />}
      fr={<TrackLayout content={content.fr} coursesLabel="Cours" booksLabel="Livres et cahiers" pathLabel="Parcours d'apprentissage" comingSoonLabel="Bientôt disponible" />}
    />
  );
}
