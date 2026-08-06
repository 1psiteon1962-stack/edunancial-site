import { normalizeLanguageCode } from "@/lib/international/languages";

export type CurriculumLocale = "en" | "es";
export type LaunchTrackCode = "RED" | "WHITE" | "BLUE" | "GREEN" | "GOLD" | "PURPLE" | "ORANGE" | "BLACK";

export const PUBLIC_CURRICULUM_TRACK_CODES = [
  "RED",
  "WHITE",
  "BLUE",
  "GREEN",
  "GOLD",
  "PURPLE",
  "ORANGE",
  "BLACK",
] as const satisfies readonly LaunchTrackCode[];

export function isPublicCurriculumTrack(trackCode: string): trackCode is LaunchTrackCode {
  return PUBLIC_CURRICULUM_TRACK_CODES.includes(trackCode.toUpperCase() as LaunchTrackCode);
}

export function resolveCurriculumLocale(languageCode: string): CurriculumLocale {
  return normalizeLanguageCode(languageCode) === "es" ? "es" : "en";
}

type LocalizedValue = Record<CurriculumLocale, string>;

type TrackCopy = {
  name: LocalizedValue;
  description: LocalizedValue;
  category: LocalizedValue;
  subtitle: LocalizedValue;
};

const TRACK_COPY: Record<LaunchTrackCode, TrackCopy> = {
  RED: {
    name: { en: "Real Estate", es: "Bienes raíces" },
    description: {
      en: "Master real estate as an asset class — residential, commercial, income generation, financing, and long-term wealth building.",
      es: "Domina los bienes raíces como clase de activo: vivienda, propiedades comerciales, generación de ingresos, financiamiento y creación de patrimonio a largo plazo.",
    },
    category: { en: "Real Estate", es: "Bienes raíces" },
    subtitle: {
      en: "Real estate investing strategies: rentals, tax liens, tax deeds, and creative financing.",
      es: "Estrategias de inversión inmobiliaria: alquileres, gravámenes fiscales, escrituras fiscales y financiamiento creativo.",
    },
  },
  WHITE: {
    name: { en: "Paper Assets", es: "Activos financieros" },
    description: {
      en: "Understand stocks, bonds, funds, and other financial instruments — how they work, how they generate returns, and how to evaluate them.",
      es: "Comprende acciones, bonos, fondos y otros instrumentos financieros: cómo funcionan, cómo generan rendimiento y cómo evaluarlos.",
    },
    category: { en: "Paper Assets", es: "Activos financieros" },
    subtitle: {
      en: "Paper asset investing: stocks, bonds, ETFs, and retirement accounts.",
      es: "Inversión en activos financieros: acciones, bonos, ETF y cuentas para el retiro.",
    },
  },
  BLUE: {
    name: { en: "Business", es: "Negocios" },
    description: {
      en: "Build business competency — business models, cash flow, operations, growth strategies, and the financial mechanics of entrepreneurship.",
      es: "Desarrolla competencia empresarial: modelos de negocio, flujo de efectivo, operaciones, estrategias de crecimiento y la mecánica financiera del emprendimiento.",
    },
    category: { en: "Business", es: "Negocios" },
    subtitle: {
      en: "Business competency: starting, growing, and managing a business.",
      es: "Competencia empresarial: iniciar, hacer crecer y administrar un negocio.",
    },
  },
  GREEN: {
    name: { en: "Taxes", es: "Impuestos" },
    description: {
      en: "Understand how taxation works, how to minimize your tax burden legally, and how to use the tax code as a financial tool.",
      es: "Comprende cómo funcionan los impuestos, cómo reducir legalmente tu carga fiscal y cómo usar el código tributario como herramienta financiera.",
    },
    category: { en: "Taxes", es: "Impuestos" },
    subtitle: {
      en: "Tax strategy: legal minimization, deductions, entities, and tax-advantaged wealth building.",
      es: "Estrategia fiscal: minimización legal, deducciones, entidades y creación de patrimonio con ventajas fiscales.",
    },
  },
  GOLD: {
    name: { en: "Investing & Wealth Building", es: "Inversión y creación de patrimonio" },
    description: {
      en: "Master investment principles, portfolio construction, asset allocation, and long-term wealth building strategies across all asset classes.",
      es: "Domina los principios de inversión, la construcción de carteras, la asignación de activos y las estrategias de creación de patrimonio a largo plazo en todas las clases de activos.",
    },
    category: { en: "Investing & Wealth Building", es: "Inversión y creación de patrimonio" },
    subtitle: {
      en: "Wealth building: investment fundamentals, portfolio strategy, and financial independence.",
      es: "Creación de patrimonio: fundamentos de inversión, estrategia de cartera e independencia financiera.",
    },
  },
  PURPLE: {
    name: { en: "Law", es: "Derecho" },
    description: {
      en: "Learn how legal structures, contracts, entities, and asset protection strategies work — and how to use them to protect and grow your wealth.",
      es: "Aprende cómo funcionan las estructuras legales, contratos, entidades y estrategias de protección de activos, y cómo usarlos para proteger y hacer crecer tu patrimonio.",
    },
    category: { en: "Law", es: "Derecho" },
    subtitle: {
      en: "Legal foundations: contracts, entities, asset protection, and financial law.",
      es: "Fundamentos legales: contratos, entidades, protección de activos y derecho financiero.",
    },
  },
  ORANGE: {
    name: { en: "Sales & Marketing", es: "Ventas y marketing" },
    description: {
      en: "Develop competency in sales, marketing, customer acquisition, and persuasion — the skills that drive revenue in any business or career.",
      es: "Desarrolla competencia en ventas, marketing, adquisición de clientes y persuasión: las habilidades que impulsan los ingresos en cualquier negocio o carrera.",
    },
    category: { en: "Sales & Marketing", es: "Ventas y marketing" },
    subtitle: {
      en: "Sales and marketing competency: persuasion, customer acquisition, and revenue growth.",
      es: "Competencia en ventas y marketing: persuasión, adquisición de clientes y crecimiento de ingresos.",
    },
  },
  BLACK: {
    name: { en: "Leadership & Executive Management", es: "Liderazgo y gestión ejecutiva" },
    description: {
      en: "Build leadership competency — executive decision-making, team building, organizational management, and the financial acumen required at the highest levels.",
      es: "Desarrolla competencia en liderazgo: toma de decisiones ejecutivas, formación de equipos, gestión organizacional y el criterio financiero requerido en los niveles más altos.",
    },
    category: { en: "Leadership & Executive Management", es: "Liderazgo y gestión ejecutiva" },
    subtitle: {
      en: "Leadership and executive management: decision-making, teams, and organizational financial acumen.",
      es: "Liderazgo y gestión ejecutiva: toma de decisiones, equipos y criterio financiero organizacional.",
    },
  },
};

const LESSON_TITLE_COPY: Partial<Record<string, LocalizedValue>> = {
  "RED-L1-001": { en: "Understanding Real Estate as an Asset Class", es: "Comprender los bienes raíces como clase de activo" },
  "RED-L1-002": { en: "Types of Real Estate — Residential, Commercial, and Land", es: "Tipos de bienes raíces: residencial, comercial y terreno" },
  "RED-L1-003": { en: "How Real Estate Generates Income", es: "Cómo los bienes raíces generan ingresos" },
  "RED-L1-004": { en: "The Real Estate Market Cycle", es: "El ciclo del mercado inmobiliario" },
  "RED-L1-005": { en: "Key Real Estate Financial Metrics", es: "Métricas financieras clave de bienes raíces" },
  "RED-L1-006": { en: "Understanding Property Values and Appraisals", es: "Comprender el valor de las propiedades y las tasaciones" },
  "RED-L1-007": { en: "Financing Real Estate — Mortgages, Loans, and Leverage", es: "Financiamiento inmobiliario: hipotecas, préstamos y apalancamiento" },
  "RED-L1-008": { en: "Cash Flow Analysis for Rental Properties", es: "Análisis de flujo de efectivo para propiedades de alquiler" },
  "RED-L1-009": { en: "Real Estate Risk and Due Diligence", es: "Riesgo inmobiliario y debida diligencia" },
  "RED-L1-010": { en: "Building Your Real Estate Investment Strategy", es: "Construir tu estrategia de inversión inmobiliaria" },
  "RED-L1-011": { en: "Financing Your First Investment Property", es: "Financiar tu primera propiedad de inversión" },
  "RED-L1-012": { en: "Evaluating Real Estate Markets", es: "Evaluar mercados inmobiliarios" },
  "RED-L1-013": { en: "Due Diligence — What to Inspect Before You Buy", es: "Debida diligencia: qué inspeccionar antes de comprar" },
  "RED-L1-014": { en: "Cash Flow Analysis and the 1% Rule", es: "Análisis de flujo de efectivo y la regla del 1 %" },
  "RED-L1-015": { en: "Property Management Fundamentals", es: "Fundamentos de la administración de propiedades" },
  "RED-L1-016": { en: "Real Estate Investment Entities and Structures", es: "Entidades y estructuras para invertir en bienes raíces" },
  "RED-L1-017": { en: "Depreciation and Tax Benefits of Real Estate", es: "Depreciación y beneficios fiscales de los bienes raíces" },
  "RED-L1-018": { en: "Short-Term Rentals vs. Long-Term Rentals", es: "Alquileres a corto plazo vs. alquileres a largo plazo" },
  "RED-L1-019": { en: "Wholesaling and Fix-and-Flip Strategies", es: "Estrategias de wholesaling y fix-and-flip" },
  "RED-L1-020": { en: "Syndications and Real Estate Partnerships", es: "Sindicación y alianzas inmobiliarias" },
  "RED-L1-021": { en: "Commercial Real Estate Fundamentals", es: "Fundamentos de los bienes raíces comerciales" },
  "RED-L1-022": { en: "Real Estate Risk Management", es: "Gestión del riesgo inmobiliario" },
  "RED-L1-023": { en: "Building a Real Estate Portfolio", es: "Construir una cartera inmobiliaria" },
  "RED-L1-024": { en: "Real Estate in Your Retirement Strategy", es: "Los bienes raíces en tu estrategia de jubilación" },
  "RED-L1-025": { en: "From First Property to Financial Independence", es: "De la primera propiedad a la independencia financiera" },
  "WHITE-L1-001": { en: "Understanding Paper Assets as an Asset Class", es: "Comprender los activos financieros como clase de activo" },
  "WHITE-L1-002": { en: "Stocks — Ownership, Price, and Return", es: "Acciones: propiedad, precio y rendimiento" },
  "WHITE-L1-003": { en: "Bonds — Fixed Income and Lending Returns", es: "Bonos: renta fija y rendimientos por préstamo" },
  "WHITE-L1-004": { en: "Funds — ETFs, Index Funds, and Mutual Funds", es: "Fondos: ETF, fondos indexados y fondos mutuos" },
  "WHITE-L1-005": { en: "Tax-Advantaged Accounts — 401(k), IRA, and Roth IRA", es: "Cuentas con ventajas fiscales: 401(k), IRA y Roth IRA" },
  "WHITE-L1-006": { en: "Asset Allocation and Portfolio Construction", es: "Asignación de activos y construcción de cartera" },
  "WHITE-L1-007": { en: "How the Stock Market Works — Exchanges, Orders, and Market Mechanics", es: "Cómo funciona el mercado bursátil: bolsas, órdenes y mecánica del mercado" },
  "WHITE-L1-008": { en: "Reading Financial Statements for Investors", es: "Leer estados financieros para inversionistas" },
  "WHITE-L1-009": { en: "Investment Risk — Types, Measurement, and Management", es: "Riesgo de inversión: tipos, medición y gestión" },
  "WHITE-L1-010": { en: "Building Your Paper Asset Investment Strategy", es: "Construir tu estrategia de inversión en activos financieros" },
  "WHITE-L1-011": { en: "Introduction to Options Contracts", es: "Introducción a los contratos de opciones" },
  "WHITE-L1-012": { en: "Understanding Exchange-Traded Funds", es: "Comprender los fondos cotizados en bolsa" },
  "WHITE-L1-013": { en: "Reading Financial Statements", es: "Leer estados financieros" },
  "WHITE-L1-014": { en: "Evaluating Stocks — Fundamental Analysis", es: "Evaluar acciones: análisis fundamental" },
  "WHITE-L1-015": { en: "Bonds — How They Work and Why They Matter", es: "Bonos: cómo funcionan y por qué importan" },
  "WHITE-L1-016": { en: "Dividend Investing Strategies", es: "Estrategias de inversión en dividendos" },
  "WHITE-L1-017": { en: "Retirement Accounts — 401(k), IRA, and Roth Strategies", es: "Cuentas de retiro: estrategias 401(k), IRA y Roth" },
  "WHITE-L1-018": { en: "Dollar-Cost Averaging and Systematic Investing", es: "Promedio del costo en dólares e inversión sistemática" },
  "WHITE-L1-019": { en: "Understanding Market Cycles", es: "Comprender los ciclos del mercado" },
  "WHITE-L1-020": { en: "Portfolio Construction and Asset Allocation", es: "Construcción de cartera y asignación de activos" },
  "WHITE-L1-021": { en: "Tax-Efficient Investing", es: "Inversión fiscalmente eficiente" },
  "WHITE-L1-022": { en: "Alternative Investments — REITs, Commodities, and More", es: "Inversiones alternativas: REIT, materias primas y más" },
  "WHITE-L1-023": { en: "Behavioral Finance — Why Investors Make Bad Decisions", es: "Finanzas conductuales: por qué los inversionistas toman malas decisiones" },
  "WHITE-L1-024": { en: "Building Wealth Through Compounding", es: "Construir patrimonio mediante el interés compuesto" },
  "WHITE-L1-025": { en: "From First Investment to Financial Independence", es: "De la primera inversión a la independencia financiera" },
  "BLUE-L1-001": { en: "Understanding Business as an Asset Class", es: "Comprender el negocio como clase de activo" },
  "BLUE-L1-002": { en: "Business Models — How Businesses Generate Revenue", es: "Modelos de negocio: cómo los negocios generan ingresos" },
  "BLUE-L1-003": { en: "Cash Flow in Business — Reading the Numbers", es: "Flujo de efectivo en los negocios: leer los números" },
  "BLUE-L1-004": { en: "Profit Margins — Revenue, Costs, and What's Left", es: "Márgenes de ganancia: ingresos, costos y lo que queda" },
  "BLUE-L1-005": { en: "Key Performance Indicators — Measuring What Matters", es: "Indicadores clave de desempeño: medir lo que importa" },
  "BLUE-L1-006": { en: "Pricing Strategy — Setting Prices for Profit", es: "Estrategia de precios: fijar precios para obtener ganancias" },
  "BLUE-L1-007": { en: "Customer Acquisition — The Economics of Growth", es: "Adquisición de clientes: la economía del crecimiento" },
  "BLUE-L1-008": { en: "Operations — Systems, Processes, and Efficiency", es: "Operaciones: sistemas, procesos y eficiencia" },
  "BLUE-L1-009": { en: "Business Risk and Financial Resilience", es: "Riesgo empresarial y resiliencia financiera" },
  "BLUE-L1-010": { en: "Building Your Business Competency Foundation", es: "Construir tu base de competencia empresarial" },
  "BLUE-L1-011": { en: "Business Structures and Entity Formation", es: "Estructuras empresariales y formación de entidades" },
  "BLUE-L1-012": { en: "Reading a Business's Financial Health", es: "Leer la salud financiera de un negocio" },
  "BLUE-L1-013": { en: "Pricing Strategy and Profit Margins", es: "Estrategia de precios y márgenes de ganancia" },
  "BLUE-L1-014": { en: "Customer Acquisition and the Revenue Engine", es: "Adquisición de clientes y motor de ingresos" },
  "BLUE-L1-015": { en: "Business Cash Flow Management", es: "Gestión del flujo de efectivo empresarial" },
  "BLUE-L1-016": { en: "Operations and Systems Thinking", es: "Operaciones y pensamiento sistémico" },
  "BLUE-L1-017": { en: "Hiring, Compensation, and Building a Team", es: "Contratación, compensación y construcción de equipo" },
  "BLUE-L1-018": { en: "Business Credit and Commercial Financing", es: "Crédito empresarial y financiamiento comercial" },
  "BLUE-L1-019": { en: "Scaling a Business — Growth Levers and Capital Allocation", es: "Escalar un negocio: palancas de crecimiento y asignación de capital" },
  "BLUE-L1-020": { en: "Intellectual Property for Business Owners", es: "Propiedad intelectual para dueños de negocios" },
  "BLUE-L1-021": { en: "Exit Strategies — How Business Owners Create Liquidity", es: "Estrategias de salida: cómo los dueños de negocios crean liquidez" },
  "BLUE-L1-022": { en: "Franchising — Buying and Building", es: "Franquicias: comprar y construir" },
  "BLUE-L1-023": { en: "E-Commerce and Digital Business Models", es: "Comercio electrónico y modelos de negocio digitales" },
  "BLUE-L1-024": { en: "Business Insurance and Risk Management", es: "Seguros empresariales y gestión de riesgos" },
  "BLUE-L1-025": { en: "From First Business to Financial Independence", es: "Del primer negocio a la independencia financiera" },
};

export function getLocalizedTrackCopy(trackCode: string, locale: CurriculumLocale) {
  const copy = TRACK_COPY[trackCode.toUpperCase() as LaunchTrackCode];
  return copy
    ? {
        name: copy.name[locale],
        description: copy.description[locale],
        category: copy.category[locale],
        subtitle: copy.subtitle[locale],
      }
    : null;
}

export function getLocalizedLessonTitle(lessonId: string, locale: CurriculumLocale, fallbackTitle: string) {
  return LESSON_TITLE_COPY[lessonId]?.[locale] ?? fallbackTitle;
}
