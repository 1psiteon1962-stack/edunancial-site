import Link from "next/link";

import BilingualContent from "@/components/international/BilingualContent";

type TrackKey = "red" | "white" | "blue";

const TRACK_CONTENT: Record<TrackKey, {
  en: {
    eyebrow: string;
    title: string;
    overview: string;
    courses: string[];
    books: string[];
    path: string[];
    comingSoon: string[];
    primaryCta: { href: string; label: string };
    secondaryCta: { href: string; label: string };
  };
  es: {
    eyebrow: string;
    title: string;
    overview: string;
    courseNote: string;
    courses: string[];
    books: string[];
    path: string[];
    comingSoon: string[];
    primaryCta: { href: string; label: string };
    secondaryCta: { href: string; label: string };
  };
}> = {
  red: {
    en: {
      eyebrow: "RED — Real Estate",
      title: "Learn how wealth is built through real estate.",
      overview:
        "RED helps members move from basic property vocabulary to disciplined real-estate decisions across rentals, tax liens, tax deeds, creative finance, and long-term wealth building.",
      courses: [
        "Introduction to Real Estate Investing",
        "Rental Properties: Cash Flow Analysis",
        "Creative Financing Strategies",
      ],
      books: [
        "Real-estate vocabulary and cash-flow workbook",
        "Rental analysis worksheets",
        "Acquisition and due-diligence checklists",
      ],
      path: [
        "Build literacy with foundational RED lessons.",
        "Practice deal analysis and financing scenarios.",
        "Track progress, complete assessments, and earn certificates.",
      ],
      comingSoon: [
        "Expanded tax-lien and tax-deed scenario labs",
        "Advanced acquisition templates",
      ],
      primaryCta: { href: "/courses/red-real-estate", label: "View RED Courses" },
      secondaryCta: { href: "/membership", label: "Start Membership" },
    },
    es: {
      eyebrow: "RED — Bienes raíces",
      title: "Aprenda cómo se construye riqueza a través de los bienes raíces.",
      overview:
        "RED ayuda a los miembros a pasar del vocabulario básico de propiedad a decisiones disciplinadas sobre alquileres, gravámenes fiscales, escrituras fiscales, financiamiento creativo y construcción patrimonial a largo plazo.",
      courseNote:
        "Los detalles completos de cursos RED en español siguen en preparación. Mientras tanto, esta ruta aclara qué aprender y cuál es el siguiente paso correcto.",
      courses: [
        "Fundamentos de inversión inmobiliaria",
        "Análisis de flujo de efectivo para alquileres",
        "Estrategias de financiamiento creativo",
      ],
      books: [
        "Cuaderno de vocabulario inmobiliario y flujo de caja",
        "Hojas de trabajo para análisis de alquileres",
        "Listas de verificación para adquisición y debida diligencia",
      ],
      path: [
        "Construya alfabetización con lecciones RED fundamentales.",
        "Practique análisis de oportunidades y escenarios de financiamiento.",
        "Siga su progreso, complete evaluaciones y obtenga certificados.",
      ],
      comingSoon: [
        "Laboratorios ampliados sobre gravámenes y escrituras fiscales",
        "Plantillas avanzadas de adquisición",
      ],
      primaryCta: { href: "/membership", label: "Comenzar membresía" },
      secondaryCta: { href: "/courses", label: "Explorar rutas de aprendizaje" },
    },
  },
  white: {
    en: {
      eyebrow: "WHITE — Paper Assets",
      title: "Build confidence in markets, risk, and portfolio decisions.",
      overview:
        "WHITE turns financial literacy into competency across budgeting, stocks, ETFs, options, retirement accounts, and portfolio discipline.",
      courses: [
        "Introduction to Financial Assets",
        "Stocks: Fundamentals & Analysis",
        "Retirement Accounts: IRA, Roth, 401k",
      ],
      books: [
        "Asset-allocation workbook",
        "Budgeting and cash-reserve templates",
        "Market-research note sheets",
      ],
      path: [
        "Start with budgeting and asset foundations.",
        "Practice research, diversification, and risk management.",
        "Use progress tracking and certificates to reinforce disciplined action.",
      ],
      comingSoon: [
        "More scenario-based options labs",
        "Expanded portfolio review tools",
      ],
      primaryCta: { href: "/courses/white-paper-assets", label: "View WHITE Courses" },
      secondaryCta: { href: "/membership", label: "Compare Membership" },
    },
    es: {
      eyebrow: "WHITE — Activos financieros",
      title: "Desarrolle confianza en mercados, riesgo y decisiones de portafolio.",
      overview:
        "WHITE convierte la alfabetización financiera en competencia aplicada sobre presupuesto, acciones, ETF, opciones, cuentas de retiro y disciplina de portafolio.",
      courseNote:
        "Los detalles completos de cursos WHITE en español aún están en preparación. Esta página muestra la ruta, los recursos y el siguiente paso recomendado.",
      courses: [
        "Introducción a los activos financieros",
        "Acciones: fundamentos y análisis",
        "Cuentas de retiro: IRA, Roth y 401k",
      ],
      books: [
        "Cuaderno de asignación de activos",
        "Plantillas de presupuesto y reserva de efectivo",
        "Hojas para investigación de mercado",
      ],
      path: [
        "Comience con presupuesto y fundamentos de activos.",
        "Practique investigación, diversificación y gestión del riesgo.",
        "Use el seguimiento de progreso y los certificados para reforzar la acción disciplinada.",
      ],
      comingSoon: [
        "Más laboratorios de opciones basados en escenarios",
        "Herramientas ampliadas de revisión de portafolio",
      ],
      primaryCta: { href: "/membership", label: "Comparar membresía" },
      secondaryCta: { href: "/courses", label: "Explorar rutas de aprendizaje" },
    },
  },
  blue: {
    en: {
      eyebrow: "BLUE — Business",
      title: "Turn business activity into measurable profit and progress.",
      overview:
        "BLUE helps members learn entrepreneurship, pricing, profit, KPIs, marketing, and systems so business decisions become disciplined and repeatable.",
      courses: [
        "Introduction to Business Competency",
        "KPIs: Running on Data",
        "Pricing Strategy for Profit",
      ],
      books: [
        "Business scorecard workbook",
        "Pricing and margin worksheets",
        "Operations and leadership planning templates",
      ],
      path: [
        "Learn the language of revenue, profit, and customer value.",
        "Practice with KPIs, pricing, and operational systems.",
        "Turn lessons into decisions you can measure over time.",
      ],
      comingSoon: [
        "Expanded leadership and hiring playbooks",
        "Advanced business-systems scorecards",
      ],
      primaryCta: { href: "/courses/blue-business", label: "View BLUE Courses" },
      secondaryCta: { href: "/membership", label: "Upgrade Membership" },
    },
    es: {
      eyebrow: "BLUE — Negocios",
      title: "Convierta la actividad empresarial en utilidad y progreso medibles.",
      overview:
        "BLUE ayuda a los miembros a aprender emprendimiento, precios, utilidad, KPI, marketing y sistemas para que las decisiones de negocio sean disciplinadas y repetibles.",
      courseNote:
        "Los detalles completos de cursos BLUE en español siguen en preparación. La ruta actual muestra qué aprender ahora y cómo avanzar sin puntos muertos.",
      courses: [
        "Introducción a la competencia empresarial",
        "KPI: gestionar con datos",
        "Estrategia de precios para obtener utilidad",
      ],
      books: [
        "Cuaderno de indicadores empresariales",
        "Hojas de trabajo de precios y márgenes",
        "Plantillas de operaciones y liderazgo",
      ],
      path: [
        "Aprenda el lenguaje de ingresos, utilidad y valor al cliente.",
        "Practique con KPI, precios y sistemas operativos.",
        "Convierta las lecciones en decisiones medibles en el tiempo.",
      ],
      comingSoon: [
        "Guías ampliadas de liderazgo y contratación",
        "Tableros avanzados de sistemas empresariales",
      ],
      primaryCta: { href: "/membership", label: "Actualizar membresía" },
      secondaryCta: { href: "/courses", label: "Explorar rutas de aprendizaje" },
    },
  },
};

function SectionList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
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

export default function TrackLandingPage({ track }: { track: TrackKey }) {
  const content = TRACK_CONTENT[track];

  return (
    <BilingualContent
      en={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-6xl px-6 py-24">
            <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
              {content.en.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
              {content.en.title}
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
              {content.en.overview}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={content.en.primaryCta.href} className="rounded-xl bg-blue-600 px-6 py-4 font-bold hover:bg-blue-700">
                {content.en.primaryCta.label}
              </Link>
              <Link href={content.en.secondaryCta.href} className="rounded-xl border border-white/20 px-6 py-4 font-bold hover:bg-white hover:text-slate-950">
                {content.en.secondaryCta.label}
              </Link>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-2">
              <SectionList title="Courses" items={content.en.courses} />
              <SectionList title="Books & Workbooks" items={content.en.books} />
              <SectionList title="Learning Path" items={content.en.path} />
              <SectionList title="Coming Soon" items={content.en.comingSoon} />
            </div>
          </section>
        </main>
      }
      es={
        <main className="min-h-screen bg-[#08101f] text-white">
          <section className="mx-auto max-w-6xl px-6 py-24">
            <p className="text-sm font-black uppercase tracking-[0.45em] text-yellow-400">
              {content.es.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-tight md:text-6xl">
              {content.es.title}
            </h1>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-300">
              {content.es.overview}
            </p>
            <div className="mt-8 rounded-2xl border border-blue-400/30 bg-blue-500/10 p-6 text-slate-200">
              <p className="font-semibold text-blue-200">Contenido en español en desarrollo</p>
              <p className="mt-3 leading-7">{content.es.courseNote}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href={content.es.primaryCta.href} className="rounded-xl bg-blue-600 px-6 py-4 font-bold hover:bg-blue-700">
                {content.es.primaryCta.label}
              </Link>
              <Link href={content.es.secondaryCta.href} className="rounded-xl border border-white/20 px-6 py-4 font-bold hover:bg-white hover:text-slate-950">
                {content.es.secondaryCta.label}
              </Link>
            </div>

            <div className="mt-16 grid gap-6 lg:grid-cols-2">
              <SectionList title="Cursos" items={content.es.courses} />
              <SectionList title="Libros y cuadernos" items={content.es.books} />
              <SectionList title="Ruta de aprendizaje" items={content.es.path} />
              <SectionList title="Próximamente" items={content.es.comingSoon} />
            </div>
          </section>
        </main>
      }
    />
  );
}
