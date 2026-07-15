export type MembershipCopyLanguage = "en" | "es" | "fr-CA" | "fr-FR";

const MEMBERSHIP_PLAN_COPY = {
  basic: {
    name: {
      en: "Basic Membership",
      es: "Membresía Básica",
      "fr-CA": "Adhésion de base",
      "fr-FR": "Adhésion de base",
    },
    description: {
      en: "Structured learning resources, guided sessions, practical exercises, and member tools for financial literacy and competency growth.",
      es: "Recursos de aprendizaje estructurados, sesiones guiadas, ejercicios prácticos y herramientas para fortalecer la alfabetización y competencia financiera.",
      "fr-CA": "Ressources d'apprentissage structurées, séances guidées, exercices pratiques et outils pour renforcer la littératie et la compétence financière.",
      "fr-FR": "Ressources d'apprentissage structurées, séances guidées, exercices pratiques et outils pour renforcer la littératie et la compétence financière.",
    },
    billingLabel: {
      en: "per month",
      es: "por mes",
      "fr-CA": "par mois",
      "fr-FR": "par mois",
    },
    ctaLabel: {
      en: "Choose Basic Membership",
      es: "Elegir Membresía Básica",
      "fr-CA": "Choisir l'adhésion de base",
      "fr-FR": "Choisir l'adhésion de base",
    },
  },
  premium: {
    name: {
      en: "Pro Membership",
      es: "Membresía Pro",
      "fr-CA": "Adhésion Pro",
      "fr-FR": "Adhésion Pro",
    },
    description: {
      en: "Expanded member benefits with deeper learning access, downloads, and AI financial coach support.",
      es: "Beneficios ampliados con mayor acceso de aprendizaje, descargas y soporte del Coach Financiero con IA.",
      "fr-CA": "Avantages élargis avec un accès approfondi à l'apprentissage, des téléchargements et le support du Coach financier IA.",
      "fr-FR": "Avantages élargis avec un accès approfondi à l'apprentissage, des téléchargements et le support du Coach financier IA.",
    },
    billingLabel: {
      en: "per month",
      es: "por mes",
      "fr-CA": "par mois",
      "fr-FR": "par mois",
    },
    ctaLabel: {
      en: "Choose Pro Membership",
      es: "Elegir Membresía Pro",
      "fr-CA": "Choisir l'adhésion Pro",
      "fr-FR": "Choisir l'adhésion Pro",
    },
  },
  enterprise: {
    name: {
      en: "Gold Membership",
      es: "Membresía Gold",
      "fr-CA": "Adhésion Gold",
      "fr-FR": "Adhésion Gold",
    },
    description: {
      en: "Full membership access for advanced learners with priority support and premium tools.",
      es: "Acceso completo para aprendizaje avanzado con soporte prioritario y herramientas premium.",
      "fr-CA": "Accès complet pour les apprenants avancés avec un support prioritaire et des outils premium.",
      "fr-FR": "Accès complet pour les apprenants avancés avec un support prioritaire et des outils premium.",
    },
    billingLabel: {
      en: "per month",
      es: "por mes",
      "fr-CA": "par mois",
      "fr-FR": "par mois",
    },
    ctaLabel: {
      en: "Choose Gold Membership",
      es: "Elegir Membresía Gold",
      "fr-CA": "Choisir l'adhésion Gold",
      "fr-FR": "Choisir l'adhésion Gold",
    },
  },
  beta: {
    name: {
      en: "Trial Membership",
      es: "Membresía de Prueba",
      "fr-CA": "Adhésion d'essai",
      "fr-FR": "Adhésion d'essai",
    },
    description: {
      en: "Optional starter plan for North America launch campaigns when trial enrollment is enabled.",
      es: "Plan inicial opcional para campañas de lanzamiento en Norteamérica cuando la prueba está habilitada.",
      "fr-CA": "Plan de démarrage optionnel pour les campagnes de lancement en Amérique du Nord lorsque l'inscription à l'essai est activée.",
      "fr-FR": "Plan de démarrage optionnel pour les campagnes de lancement en Amérique du Nord lorsque l'inscription à l'essai est activée.",
    },
    billingLabel: {
      en: "introductory trial",
      es: "prueba introductoria",
      "fr-CA": "essai d'introduction",
      "fr-FR": "essai d'introduction",
    },
    ctaLabel: {
      en: "Start Trial Membership",
      es: "Iniciar Membresía de Prueba",
      "fr-CA": "Commencer l'adhésion d'essai",
      "fr-FR": "Commencer l'adhésion d'essai",
    },
    legalNote: {
      en: "Trial availability is controlled by launch configuration.",
      es: "La disponibilidad de la prueba se controla por configuración de lanzamiento.",
      "fr-CA": "La disponibilité de l'essai est contrôlée par la configuration de lancement.",
      "fr-FR": "La disponibilité de l'essai est contrôlée par la configuration de lancement.",
    },
  },
} as const;

const MEMBERSHIP_FEATURE_COPY = {
  assessmentIncluded: {
    en: "Competency Assessment",
    es: "Evaluación de competencia",
    "fr-CA": "Évaluation des compétences",
    "fr-FR": "Évaluation des compétences",
  },
  marketplaceIncluded: {
    en: "Marketplace Access",
    es: "Acceso al mercado",
    "fr-CA": "Accès au marché",
    "fr-FR": "Accès au marché",
  },
  aiCoachIncluded: {
    en: "AI Coach",
    es: "Coach con IA",
    "fr-CA": "Coach IA",
    "fr-FR": "Coach IA",
  },
  downloadableCourses: {
    en: "Downloadable Learning Resources",
    es: "Recursos de aprendizaje descargables",
    "fr-CA": "Ressources d'apprentissage téléchargeables",
    "fr-FR": "Ressources d'apprentissage téléchargeables",
  },
  prioritySupport: {
    en: "Priority Support",
    es: "Soporte prioritario",
    "fr-CA": "Support prioritaire",
    "fr-FR": "Support prioritaire",
  },
  maxCertificates: {
    en: "Certificates of Completion",
    es: "Certificados de finalización",
    "fr-CA": "Certificats d'achèvement",
    "fr-FR": "Certificats d'achèvement",
  },
} as const;

type PlanId = keyof typeof MEMBERSHIP_PLAN_COPY;
type FeatureId = keyof typeof MEMBERSHIP_FEATURE_COPY;

function resolveLanguage(language: MembershipCopyLanguage): "en" | "es" | "fr-CA" | "fr-FR" {
  return language;
}

export function getMembershipPlanCopy(
  planId: PlanId,
  language: MembershipCopyLanguage
) {
  const plan = MEMBERSHIP_PLAN_COPY[planId];
  const lang = resolveLanguage(language);

  return {
    name: plan.name[lang],
    description: plan.description[lang],
    billingLabel: plan.billingLabel[lang],
    ctaLabel: plan.ctaLabel[lang],
    legalNote: "legalNote" in plan ? plan.legalNote[lang] : undefined,
  };
}

export function getMembershipFeatureLabel(
  feature: FeatureId,
  language: MembershipCopyLanguage
) {
  return MEMBERSHIP_FEATURE_COPY[feature][resolveLanguage(language)];
}
