import type { Language } from "@/lib/languages";

export type RegionKey =
  | "us"
  | "europe"
  | "africa"
  | "asia"
  | "asia-emerging"
  | "asia-pacific";

export type Pricing = {
  currency: string;
  monthly: number;
  annual: number;

  // Optional expansions (keeps TS happy if some regions only have monthly/annual)
  quarterly?: number;
  lifetime?: number;
  enterpriseMonthly?: number;
  enterpriseAnnual?: number;
};

export type RegionCurriculumContent = {
  regionKey: RegionKey;
  headline: string;
  subheadline: string;

  highlights: string[]; // short bullets above the curriculum list
  curriculum: string[]; // the main list used by RegionCurriculum

  pricing: Pricing;

  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };

  legalNote: string;
};

export type RegionContentMap = Record<RegionKey, Record<Language, RegionCurriculumContent>>;

export const regionContent: RegionContentMap = {
  us: {
    en: {
      regionKey: "us",
      headline: "Financial Literacy for the U.S. — Build Wealth with Structure",
      subheadline:
        "Courses, tools, and step-by-step playbooks for entrepreneurs and everyday investors.",
      highlights: [
        "Credit, budgeting, business formation basics",
        "Stocks, options, real estate fundamentals",
        "Plain-English systems you can apply immediately",
      ],
      curriculum: [
        "Money Basics: income, expenses, budgets that actually work",
        "Credit & Lending: scores, utilization, disputes, approvals",
        "Business Foundations: LLC vs Corp, banking, bookkeeping",
        "Investing Basics: risk, time horizon, diversification",
        "Stocks & Options: calls, puts, when NOT to trade",
        "Real Estate: rentals, flipping, financing, deal math",
        "Protection: contracts, risk controls, compliance habits",
        "Scale: systems, hiring, SOPs, dashboards, KPIs",
      ],
      pricing: { currency: "USD", monthly: 19, annual: 190, quarterly: 49, lifetime: 399 },
      ctaPrimary: { label: "Start Membership", href: "/us/en/pricing" },
      ctaSecondary: { label: "View Courses", href: "/us/en/courses" },
      legalNote:
        "Educational use only. Not legal, financial, tax, or investment advice. Consult qualified professionals.",
    },
    es: {
      regionKey: "us",
      headline: "Educación Financiera en EE. UU. — Construye Riqueza con Estructura",
      subheadline:
        "Cursos, herramientas y guías paso a paso para emprendedores e inversionistas.",
      highlights: [
        "Crédito, presupuesto y bases de negocio",
        "Acciones, opciones y fundamentos de bienes raíces",
        "Sistemas claros y aplicables de inmediato",
      ],
      curriculum: [
        "Fundamentos del Dinero: ingresos, gastos, presupuestos reales",
        "Crédito y Préstamos: puntajes, uso, disputas, aprobaciones",
        "Bases de Negocio: LLC vs Corp, bancos, contabilidad",
        "Inversión Básica: riesgo, horizonte, diversificación",
        "Acciones y Opciones: calls, puts, cuándo NO operar",
        "Bienes Raíces: rentas, flipping, financiamiento, números",
        "Protección: contratos, controles de riesgo, cumplimiento",
        "Escala: sistemas, SOPs, tableros y KPIs",
      ],
      pricing: { currency: "USD", monthly: 19, annual: 190, quarterly: 49, lifetime: 399 },
      ctaPrimary: { label: "Comenzar Membresía", href: "/us/es/pricing" },
      ctaSecondary: { label: "Ver Cursos", href: "/us/es/courses" },
      legalNote:
        "Solo para fines educativos. No es asesoría legal, financiera, fiscal ni de inversión. Consulte profesionales calificados.",
    },
  },

  europe: {
    en: {
      regionKey: "europe",
      headline: "Europe — Wealth Building with Compliance & Long-Term Strategy",
      subheadline:
        "Learn financial systems that respect regulation, risk, and sustainable growth.",
      highlights: [
        "Budgeting + investing with real risk controls",
        "Business setup mindset + documentation habits",
        "Long-term compounding with discipline",
      ],
      curriculum: [
        "Personal Finance: budgets, savings rates, emergency funds",
        "Investing: long-term portfolios, risk, diversification",
        "Business Basics: structure, banking, record-keeping",
        "Compliance Habits: documentation, contracts, internal controls",
        "Real Estate: deal math, rental yield, cashflow discipline",
        "Protection: insurance concepts, second-order risks",
        "Scale: processes, KPIs, operational discipline",
      ],
      pricing: { currency: "EUR", monthly: 15, annual: 150 }, // OK with optional fields
      ctaPrimary: { label: "Start Membership", href: "/europe/en/pricing" },
      ctaSecondary: { label: "View Courses", href: "/europe/en/courses" },
      legalNote:
        "Educational use only. Not legal, financial, tax, or investment advice. Consult qualified professionals.",
    },
    es: {
      regionKey: "europe",
      headline: "Europa — Construcción de Riqueza con Cumplimiento y Estrategia",
      subheadline:
        "Sistemas financieros con enfoque en regulación, riesgo y crecimiento sostenible.",
      highlights: [
        "Presupuesto + inversión con controles de riesgo",
        "Mentalidad empresarial + documentación",
        "Interés compuesto con disciplina",
      ],
      curriculum: [
        "Finanzas Personales: presupuesto, ahorro, fondo de emergencia",
        "Inversión: portafolios a largo plazo, riesgo, diversificación",
        "Negocio: estructura, bancos, registros",
        "Hábitos de Cumplimiento: contratos, controles internos",
        "Bienes Raíces: números, rendimiento, flujo de efectivo",
        "Protección: seguros y riesgos de segundo orden",
        "Escala: procesos, KPIs, disciplina operativa",
      ],
      pricing: { currency: "EUR", monthly: 15, annual: 150 },
      ctaPrimary: { label: "Comenzar Membresía", href: "/europe/es/pricing" },
      ctaSecondary: { label: "Ver Cursos", href: "/europe/es/courses" },
      legalNote:
        "Solo para fines educativos. No es asesoría legal, financiera, fiscal ni de inversión. Consulte profesionales calificados.",
    },
  },

  africa: {
    en: {
      regionKey: "africa",
      headline: "Africa — Practical Finance for Entrepreneurs & Families",
      subheadline:
        "Stability first, then growth: budgeting, business systems, and investing basics.",
      highlights: [
        "Cashflow discipline + survival-to-growth planning",
        "Business basics that work with real constraints",
        "Risk management and documentation habits",
      ],
      curriculum: [
        "Money Stability: budgets, emergency fund, debt control",
        "Income Growth: skills, pricing, small-business fundamentals",
        "Business Setup: record keeping, invoices, simple contracts",
        "Banking & Payments: safe practices, fraud avoidance habits",
        "Investing Basics: risk, diversification, long-term mindset",
        "Real Estate Basics: rent vs buy math, simple ROI thinking",
        "Protection: compliance habits, risk controls, insurance concepts",
        "Scale: SOPs, hiring, KPIs, simple dashboards",
      ],
      pricing: { currency: "USD", monthly: 9, annual: 90 },
      ctaPrimary: { label: "Start Membership", href: "/africa/en/pricing" },
      ctaSecondary: { label: "View Courses", href: "/africa/en/courses" },
      legalNote:
        "Educational use only. Not legal, financial, tax, or investment advice. Consult qualified professionals.",
    },
    es: {
      regionKey: "africa",
      headline: "África — Finanzas Prácticas para Emprendedores y Familias",
      subheadline:
        "Primero estabilidad, luego crecimiento: presupuesto, negocio e inversión básica.",
      highlights: [
        "Disciplina de flujo de efectivo y planificación",
        "Bases de negocio con limitaciones reales",
        "Gestión de riesgo y documentación",
      ],
      curriculum: [
        "Estabilidad: presupuesto, fondo de emergencia, control de deuda",
        "Crecimiento: habilidades, precios, fundamentos del negocio",
        "Negocio: registros, facturas, contratos simples",
        "Bancos y Pagos: prácticas seguras y anti-fraude",
        "Inversión Básica: riesgo, diversificación, mentalidad a largo plazo",
        "Bienes Raíces: matemáticas simples de ROI",
        "Protección: cumplimiento, controles y seguros",
        "Escala: SOPs, contratación, KPIs, tableros simples",
      ],
      pricing: { currency: "USD", monthly: 9, annual: 90 },
      ctaPrimary: { label: "Comenzar Membresía", href: "/africa/es/pricing" },
      ctaSecondary: { label: "Ver Cursos", href: "/africa/es/courses" },
      legalNote:
        "Solo para fines educativos. No es asesoría legal, financiera, fiscal ni de inversión. Consulte profesionales calificados.",
    },
  },

  asia: {
    en: {
      regionKey: "asia",
      headline: "Asia — High-Discipline Finance & Modern Growth Systems",
      subheadline:
        "Structured learning for financial stability, investing basics, and scalable business systems.",
      highlights: [
        "Systems thinking + disciplined execution",
        "Risk management and operational structure",
        "Investing basics with long-term focus",
      ],
      curriculum: [
        "Financial Foundation: budgets, savings, stability planning",
        "Investing Basics: risk, diversification, long-term strategy",
        "Business Foundations: structure, accounting, operations",
        "Process Discipline: SOPs, checklists, documentation",
        "Growth: pricing, marketing basics, retention, KPIs",
        "Protection: contracts, risk controls, compliance habits",
      ],
      pricing: { currency: "USD", monthly: 11, annual: 110 },
      ctaPrimary: { label: "Start Membership", href: "/asia/en/pricing" },
      ctaSecondary: { label: "View Courses", href: "/asia/en/courses" },
      legalNote:
        "Educational use only. Not legal, financial, tax, or investment advice. Consult qualified professionals.",
    },
    es: {
      regionKey: "asia",
      headline: "Asia — Finanzas con Disciplina y Sistemas Modernos",
      subheadline:
        "Aprendizaje estructurado para estabilidad, inversión básica y negocios escalables.",
      highlights: [
        "Pensamiento sistémico y ejecución disciplinada",
        "Gestión de riesgo y estructura operativa",
        "Inversión básica a largo plazo",
      ],
      curriculum: [
        "Fundación Financiera: presupuesto, ahorro, estabilidad",
        "Inversión Básica: riesgo, diversificación, estrategia",
        "Negocio: estructura, contabilidad, operaciones",
        "Disciplina: SOPs, listas, documentación",
        "Crecimiento: precios, marketing, retención, KPIs",
        "Protección: contratos, controles y cumplimiento",
      ],
      pricing: { currency: "USD", monthly: 11, annual: 110 },
      ctaPrimary: { label: "Comenzar Membresía", href: "/asia/es/pricing" },
      ctaSecondary: { label: "Ver Cursos", href: "/asia/es/courses" },
      legalNote:
        "Solo para fines educativos. No es asesoría legal, financiera, fiscal ni de inversión. Consulte profesionales calificados.",
    },
  },

  "asia-emerging": {
    en: {
      regionKey: "asia-emerging",
      headline: "Asia (Emerging) — Stability + Growth for New Markets",
      subheadline:
        "Build cashflow stability first, then expand into business systems and investing basics.",
      highlights: [
        "Cashflow control before risk",
        "Business basics that scale",
        "Protection habits from day one",
      ],
      curriculum: [
        "Stability: budgeting, debt control, emergency fund",
        "Income: skills, pricing, simple business math",
        "Business Ops: record keeping, invoicing, contracts",
        "Growth: marketing basics, customer retention, KPIs",
        "Investing: risk basics, long-term approach",
        "Protection: compliance habits, risk controls",
      ],
      pricing: { currency: "USD", monthly: 8, annual: 80 },
      ctaPrimary: { label: "Start Membership", href: "/asia-emerging/en/pricing" },
      ctaSecondary: { label: "View Courses", href: "/asia-emerging/en/courses" },
      legalNote:
        "Educational use only. Not legal, financial, tax, or investment advice. Consult qualified professionals.",
    },
    es: {
      regionKey: "asia-emerging",
      headline: "Asia (Emergente) — Estabilidad + Crecimiento para Nuevos Mercados",
      subheadline:
        "Primero controla el flujo de efectivo, luego construye sistemas y aprende inversión básica.",
      highlights: [
        "Control del flujo antes del riesgo",
        "Bases de negocio escalables",
        "Hábitos de protección desde el día uno",
      ],
      curriculum: [
        "Estabilidad: presupuesto, deuda, fondo de emergencia",
        "Ingresos: habilidades, precios, matemáticas simples",
        "Operaciones: registros, facturas, contratos",
        "Crecimiento: marketing, retención, KPIs",
        "Inversión: riesgo básico, enfoque a largo plazo",
        "Protección: cumplimiento y controles",
      ],
      pricing: { currency: "USD", monthly: 8, annual: 80 },
      ctaPrimary: { label: "Comenzar Membresía", href: "/asia-emerging/es/pricing" },
      ctaSecondary: { label: "Ver Cursos", href: "/asia-emerging/es/courses" },
      legalNote:
        "Solo para fines educativos. No es asesoría legal, financiera, fiscal ni de inversión. Consulte profesionales calificados.",
    },
  },

  "asia-pacific": {
    en: {
      regionKey: "asia-pacific",
      headline: "Asia-Pacific — Growth, Trade, and Modern Business Systems",
      subheadline:
        "Structured learning for entrepreneurs navigating fast markets and global opportunities.",
      highlights: [
        "Business systems + execution discipline",
        "Risk controls and documentation habits",
        "Financial literacy that supports expansion",
      ],
      curriculum: [
        "Financial Foundation: budget, savings, stability",
        "Business Systems: SOPs, KPI dashboards, operations",
        "Market Growth: pricing, positioning, retention",
        "Trade Mindset: global customers, cross-border basics",
        "Investing Basics: risk, diversification, long-term strategy",
        "Protection: contracts, compliance habits, risk controls",
      ],
      pricing: { currency: "USD", monthly: 12, annual: 120 },
      ctaPrimary: { label: "Start Membership", href: "/asia-pacific/en/pricing" },
      ctaSecondary: { label: "View Courses", href: "/asia-pacific/en/courses" },
      legalNote:
        "Educational use only. Not legal, financial, tax, or investment advice. Consult qualified professionals.",
    },
    es: {
      regionKey: "asia-pacific",
      headline: "Asia-Pacífico — Crecimiento, Comercio y Sistemas Modernos",
      subheadline:
        "Aprendizaje estructurado para emprendedores en mercados rápidos y globales.",
      highlights: [
        "Sistemas de negocio y disciplina",
        "Controles de riesgo y documentación",
        "Educación financiera para expansión",
      ],
      curriculum: [
        "Base Financiera: presupuesto, ahorro, estabilidad",
        "Sistemas: SOPs, tableros KPI, operaciones",
        "Crecimiento: precios, posicionamiento, retención",
        "Comercio: clientes globales y bases transfronterizas",
        "Inversión Básica: riesgo, diversificación, estrategia",
        "Protección: contratos, cumplimiento y controles",
      ],
      pricing: { currency: "USD", monthly: 12, annual: 120 },
      ctaPrimary: { label: "Comenzar Membresía", href: "/asia-pacific/es/pricing" },
      ctaSecondary: { label: "Ver Cursos", href: "/asia-pacific/es/courses" },
      legalNote:
        "Solo para fines educativos. No es asesoría legal, financiera, fiscal ni de inversión. Consulte profesionales calificados.",
    },
  },
};
