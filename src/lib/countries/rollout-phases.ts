export type GlobalRolloutPhaseId =
  | "north-america"
  | "latin-america"
  | "caribbean"
  | "western-europe"
  | "africa"
  | "asia"
  | "middle-east";

export interface GlobalRolloutPhase {
  id: GlobalRolloutPhaseId;
  order: number;
  label: string;
  targetIsoCodes: readonly string[];
  priorityLocales: readonly string[];
  notes: readonly string[];
}

/**
 * Strategic rollout order only. Inclusion here does not enable or launch a
 * country. Country registry + readiness certification remain authoritative.
 */
export const GLOBAL_ROLLOUT_PHASES: readonly GlobalRolloutPhase[] = [
  {
    id: "north-america",
    order: 1,
    label: "North America",
    targetIsoCodes: ["US", "CA"],
    priorityLocales: ["en-US", "en-GB", "fr-CA"],
    notes: [
      "US remains the reference production market.",
      "Canada requires bilingual and tax/payment readiness before launch.",
    ],
  },
  {
    id: "latin-america",
    order: 2,
    label: "Latin America",
    targetIsoCodes: ["MX", "BR", "CO", "AR", "CL", "PE"],
    priorityLocales: ["es-Caribbean", "es-ES", "pt-BR"],
    notes: [
      "Prioritize Spanish and Brazilian Portuguese curriculum coverage.",
      "Each market remains fail-closed until country configuration and compliance are complete.",
    ],
  },
  {
    id: "caribbean",
    order: 3,
    label: "Caribbean",
    targetIsoCodes: ["PR", "DO", "JM", "BB", "BS", "KY", "TC"],
    priorityLocales: ["en-US", "es-Caribbean", "fr-CA"],
    notes: [
      "Puerto Rico requires US-territory tax/legal handling rather than ordinary foreign-country assumptions.",
      "Caribbean payment and currency support must be market-specific.",
    ],
  },
  {
    id: "western-europe",
    order: 4,
    label: "Western Europe",
    targetIsoCodes: ["GB", "ES", "FR", "DE", "IT", "NL", "PT"],
    priorityLocales: ["en-GB", "es-ES", "fr-FR", "de", "it", "nl", "pt-PT"],
    notes: [
      "These markets align directly with the current launch-language selector.",
      "Privacy, tax/VAT, consumer-law, and payment readiness remain separate launch gates.",
    ],
  },
  {
    id: "africa",
    order: 5,
    label: "Africa",
    targetIsoCodes: ["UG", "NG", "KE", "TZ", "GH", "ZA", "RW"],
    priorityLocales: ["en-US", "fr-FR"],
    notes: [
      "Existing registry markets remain planning-only until readiness certification.",
      "Future locale expansion should include additional African languages based on market need.",
    ],
  },
  {
    id: "asia",
    order: 6,
    label: "Asia",
    targetIsoCodes: ["JP", "KR", "SG", "PH", "VN", "MY", "TH", "ID", "IN"],
    priorityLocales: ["en-US"],
    notes: [
      "Japanese, Korean, Chinese variants, Hindi, and Southeast Asian languages require later locale expansion.",
      "Market launch remains independent from planning visibility in the registry.",
    ],
  },
  {
    id: "middle-east",
    order: 7,
    label: "Middle East",
    targetIsoCodes: ["AE", "SA", "QA", "KW", "BH", "OM", "JO", "IL"],
    priorityLocales: ["en-US"],
    notes: [
      "Arabic and Hebrew locale support should be added only with RTL-capable UI validation.",
      "Sanctions and jurisdiction-specific compliance remain hard launch gates.",
    ],
  },
] as const;

export function getGlobalRolloutPhase(id: GlobalRolloutPhaseId) {
  return GLOBAL_ROLLOUT_PHASES.find((phase) => phase.id === id);
}

export function getRolloutPhaseForCountry(isoCode: string) {
  const normalized = isoCode.trim().toUpperCase();
  return GLOBAL_ROLLOUT_PHASES.find((phase) => phase.targetIsoCodes.includes(normalized));
}
