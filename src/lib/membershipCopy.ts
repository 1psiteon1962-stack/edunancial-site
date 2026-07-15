export type MembershipCopyLanguage = "en" | "es" | "fr";

const MEMBERSHIP_PLAN_COPY = {
  basic: {
    name: {
      en: "Individual Membership",
      es: "Membresía individual",
    },
    description: {
      en: "Structured learning resources, guided sessions, practical exercises, and member tools for individual financial literacy and financial competency growth.",
      es: "Recursos de aprendizaje estructurados, sesiones guiadas, ejercicios prácticos y herramientas para fortalecer la alfabetización financiera y la competencia financiera de cada miembro.",
    },
    billingLabel: {
      en: "per month",
      es: "por mes",
    },
    ctaLabel: {
      en: "Choose Individual Membership",
      es: "Elegir membresía individual",
    },
  },
  premium: {
    name: {
      en: "Approved Organization Membership",
      es: "Membresía para organizaciones aprobadas",
    },
    description: {
      en: "For approved schools, nonprofits, community organizations, workforce programs, churches, youth organizations, and similar approved partners onboarding members through Edunancial.",
      es: "Para escuelas aprobadas, organizaciones sin fines de lucro, organizaciones comunitarias, programas laborales, iglesias, organizaciones juveniles y socios similares que integran miembros a través de Edunancial.",
    },
    billingLabel: {
      en: "per member / month",
      es: "por miembro / mes",
    },
    ctaLabel: {
      en: "Request organization approval",
      es: "Solicitar aprobación de la organización",
    },
    legalNote: {
      en: "Available only to approved partner organizations.",
      es: "Disponible solo para organizaciones asociadas aprobadas.",
    },
  },
  enterprise: {
    name: {
      en: "100+ Member Organization Rate",
      es: "Tarifa para organizaciones de 100+ miembros",
    },
    description: {
      en: "For organizations with at least 100 active paid members under a formal organizational agreement.",
      es: "Para organizaciones con al menos 100 miembros activos de pago bajo un acuerdo organizacional formal.",
    },
    billingLabel: {
      en: "per active paid member / month",
      es: "por miembro activo de pago / mes",
    },
    ctaLabel: {
      en: "Contact for 100+ member agreement",
      es: "Contactar para un acuerdo de 100+ miembros",
    },
    legalNote: {
      en: "Minimum 100 active paid members and a formal organizational agreement required.",
      es: "Se requieren al menos 100 miembros activos de pago y un acuerdo organizacional formal.",
    },
  },
  beta: {
    name: {
      en: "Beta Tester",
      es: "Probador beta",
    },
    description: {
      en: "Invitation-only access for approved testers evaluating Edunancial membership experiences before public release milestones.",
      es: "Acceso solo por invitación para evaluadores aprobados que analizan la experiencia de membresía de Edunancial antes de hitos de lanzamiento público.",
    },
    billingLabel: {
      en: "invitation only",
      es: "solo por invitación",
    },
    ctaLabel: {
      en: "Redeem beta invitation",
      es: "Canjear invitación beta",
    },
    legalNote: {
      en: "Hidden from public pricing. Beta access starts at first successful login and expires 72 hours later unless explicitly extended by an administrator.",
      es: "Oculto del precio público. El acceso beta comienza en el primer inicio de sesión exitoso y expira 72 horas después, salvo extensión explícita por un administrador.",
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
  const resolvedLanguage = language === "fr" ? "en" : language;

  return {
    name: plan.name[resolvedLanguage],
    description: plan.description[resolvedLanguage],
    billingLabel: plan.billingLabel[resolvedLanguage],
    ctaLabel: plan.ctaLabel[resolvedLanguage],
    legalNote: "legalNote" in plan ? plan.legalNote[resolvedLanguage] : undefined,
  };
}

export function getMembershipFeatureLabel(
  feature: keyof typeof MEMBERSHIP_FEATURE_COPY,
  language: MembershipCopyLanguage
) {
  const resolvedLanguage = language === "fr" ? "en" : language;
  return MEMBERSHIP_FEATURE_COPY[feature][resolvedLanguage];
}
