export type GlobalRolloutPhaseId =
  | "north-america"
  | "latin-america"
  | "caribbean"
  | "western-europe"
  | "africa"
  | "central-europe"
  | "middle-east"
  | "asia"
  | "eastern-europe"
  | "asia-expansion";

/** Owner-approved launch wave (2026-11-17). Planning only; never a launch switch. */
export type OwnerApprovedWave = 4 | 5;

export interface GlobalRolloutPhase {
  id: GlobalRolloutPhaseId;
  order: number;
  label: string;
  targetIsoCodes: readonly string[];
  priorityLocales: readonly string[];
  notes: readonly string[];
  /** Owner-approved wave for European, Middle East, and Asian markets. */
  ownerApprovedWave?: OwnerApprovedWave;
  /** Rollout planning is private: never shown publicly, never sellable. */
  visibility: "private";
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
    visibility: "private",
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
    visibility: "private",
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
    visibility: "private",
  },
  {
    id: "western-europe",
    order: 4,
    label: "Western Europe",
    targetIsoCodes: [
      "GB", "IE", "FR", "DE", "NL", "BE", "LU", "ES", "PT", "IT", "MT", "AT", "CH", "DK", "SE", "NO", "FI",
      "IS", "LI", "MC", "AD", "SM",
    ],
    priorityLocales: ["en-GB", "es-ES", "fr-FR", "de", "it", "nl", "pt-PT"],
    notes: [
      "Owner-approved wave 4 (2026-11-17). IS, LI, MC, AD and SM are optional small states.",
      "Privacy, tax/VAT, consumer-law, and payment readiness remain separate launch gates.",
    ],
    ownerApprovedWave: 4,
    visibility: "private",
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
    visibility: "private",
  },
  {
    id: "central-europe",
    order: 6,
    label: "Central Europe",
    targetIsoCodes: ["PL", "CZ", "SK", "HU", "SI"],
    priorityLocales: ["en-GB", "de"],
    notes: [
      "Owner-approved wave 4 (2026-11-17).",
      "Local-language curriculum is a later locale expansion.",
    ],
    ownerApprovedWave: 4,
    visibility: "private",
  },
  {
    id: "middle-east",
    order: 7,
    label: "Middle East",
    targetIsoCodes: ["AE", "SA", "QA", "KW", "BH", "OM", "JO", "IL", "TR"],
    priorityLocales: ["en-US"],
    notes: [
      "Owner-approved wave 4 (2026-11-17). Turkey is planned with the Middle East.",
      "Arabic, Hebrew and Turkish locale support should be added only with RTL-capable UI validation where needed.",
      "Sanctions and jurisdiction-specific compliance remain hard launch gates.",
    ],
    ownerApprovedWave: 4,
    visibility: "private",
  },
  {
    id: "asia",
    order: 8,
    label: "Asia (fiscally sound markets)",
    targetIsoCodes: ["SG", "JP", "KR", "TW", "HK", "MY", "BN"],
    priorityLocales: ["en-US"],
    notes: [
      "Owner-approved wave 4 (2026-11-17). China is held for owner review.",
      "Japanese, Korean and Chinese variants require later locale expansion.",
    ],
    ownerApprovedWave: 4,
    visibility: "private",
  },
  {
    id: "eastern-europe",
    order: 9,
    label: "Eastern Europe",
    targetIsoCodes: [
      "EE", "LV", "LT", "RO", "BG", "HR", "GR", "CY", "RS", "BA", "ME", "MK", "AL", "XK", "MD", "UA",
      "GE", "AM", "AZ",
    ],
    priorityLocales: ["en-GB"],
    notes: [
      "Owner-approved wave 5 (2026-11-17). GE, AM and AZ are optional.",
      "Occupied Ukrainian regions stay blocked by the site-access sanctions policy.",
    ],
    ownerApprovedWave: 5,
    visibility: "private",
  },
  {
    id: "asia-expansion",
    order: 10,
    label: "Asia (expansion markets)",
    targetIsoCodes: ["IN", "ID", "PH", "VN", "TH", "BD", "PK", "LK", "NP", "KH", "MN", "KZ"],
    priorityLocales: ["en-US"],
    notes: [
      "Owner-approved wave 5 (2026-11-17).",
      "Hindi and Southeast Asian languages require later locale expansion.",
    ],
    ownerApprovedWave: 5,
    visibility: "private",
  },
] as const;

/**
 * Never planned for rollout. Sanctioned markets stay off; the second group is
 * held off for now by owner decision (2026-11-17).
 */
export const ROLLOUT_EXCLUDED_ISO_CODES: Readonly<Record<string, string>> = {
  RU: "Sanctions: stays off",
  BY: "Sanctions: stays off",
  IR: "Sanctions: stays off",
  SY: "Sanctions: stays off",
  KP: "Sanctions: stays off",
  CU: "Sanctions: stays off",
  AF: "Off for now (owner decision)",
  MM: "Off for now (owner decision)",
  YE: "Off for now (owner decision)",
  LB: "Off for now (owner decision)",
  IQ: "Off for now (owner decision)",
};

/** Held for owner review; not in any rollout phase. */
export const ROLLOUT_HELD_FOR_REVIEW_ISO_CODES: readonly string[] = ["CN"];

export function getGlobalRolloutPhase(id: GlobalRolloutPhaseId) {
  return GLOBAL_ROLLOUT_PHASES.find((phase) => phase.id === id);
}

export function getRolloutPhaseForCountry(isoCode: string) {
  const normalized = isoCode.trim().toUpperCase();
  return GLOBAL_ROLLOUT_PHASES.find((phase) => phase.targetIsoCodes.includes(normalized));
}
