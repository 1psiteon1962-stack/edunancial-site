export type MembershipCopyLanguage = "en" | "es";

const MEMBERSHIP_PLAN_COPY = {
  basic: {
    name: {
      en: "Basic Membership",
      es: "Membresía Básica",
    },
    description: {
      en: "Structured learning resources, guided sessions, practical exercises, and member tools for financial literacy and competency growth.",
      es: "Recursos de aprendizaje estructurados, sesiones guiadas, ejercicios prácticos y herramientas para fortalecer la alfabetización y competencia financiera.",
    },
    billingLabel: {
      en: "per month",
      es: "por mes",
    },
    ctaLabel: {
      en: "Choose Basic Membership",
      es: "Elegir Membresía Básica",
    },
  },
  premium: {
    name: {
      en: "Pro Membership",
      es: "Membresía Pro",
    },
    description: {
      en: "Expanded member benefits with deeper learning access, downloads, and AI financial coach support.",
      es: "Beneficios ampliados con mayor acceso de aprendizaje, descargas y soporte del Coach Financiero con IA.",
    },
    billingLabel: {
      en: "per month",
      es: "por mes",
    },
    ctaLabel: {
      en: "Choose Pro Membership",
      es: "Elegir Membresía Pro",
    },
  },
  enterprise: {
    name: {
      en: "Gold Membership",
      es: "Membresía Gold",
    },
    description: {
      en: "Full membership access for advanced learners with priority support and premium tools.",
      es: "Acceso completo para aprendizaje avanzado con soporte prioritario y herramientas premium.",
    },
    billingLabel: {
      en: "per month",
      es: "por mes",
    },
    ctaLabel: {
      en: "Choose Gold Membership",
      es: "Elegir Membresía Gold",
    },
  },
  beta: {
    name: {
      en: "Trial Membership",
      es: "Membresía de Prueba",
    },
    description: {
      en: "Optional starter plan for North America launch campaigns when trial enrollment is enabled.",
      es: "Plan inicial opcional para campañas de lanzamiento en Norteamérica cuando la prueba está habilitada.",
    },
    billingLabel: {
      en: "introductory trial",
      es: "prueba introductoria",
    },
    ctaLabel: {
      en: "Start Trial Membership",
      es: "Iniciar Membresía de Prueba",
    },
    legalNote: {
      en: "Trial availability is controlled by launch configuration.",
      es: "La disponibilidad de la prueba se controla por configuración de lanzamiento.",
    },
  },
} as const;

const MEMBERSHIP_FEATURE_COPY = {
  assessmentIncluded: {
    en: "Competency Assessment",
    es: "Evaluación de competencia",
  },
  marketplaceIncluded: {
    en: "Marketplace Access",
    es: "Acceso al mercado",
  },
  aiCoachIncluded: {
    en: "AI Coach",
    es: "Coach con IA",
  },
  downloadableCourses: {
    en: "Downloadable Learning Resources",
    es: "Recursos de aprendizaje descargables",
  },
  prioritySupport: {
    en: "Priority Support",
    es: "Soporte prioritario",
  },
  maxCertificates: {
    en: "Certificates of Completion",
    es: "Certificados de finalización",
  },
} as const;

export function getMembershipPlanCopy(
  planId: keyof typeof MEMBERSHIP_PLAN_COPY,
  language: MembershipCopyLanguage
) {
  const plan = MEMBERSHIP_PLAN_COPY[planId];

  return {
    name: plan.name[language],
    description: plan.description[language],
    billingLabel: plan.billingLabel[language],
    ctaLabel: plan.ctaLabel[language],
    legalNote: "legalNote" in plan ? plan.legalNote[language] : undefined,
  };
}

export function getMembershipFeatureLabel(
  feature: keyof typeof MEMBERSHIP_FEATURE_COPY,
  language: MembershipCopyLanguage
) {
  return MEMBERSHIP_FEATURE_COPY[feature][language];
}
