// ======================================================
// AI COUNTRY SELECTION FRAMEWORK
// Supports learner-driven country selection without
// assuming any specific country's law or terminology.
// Country knowledge is loaded from the country-knowledge
// module — never embedded directly in prompts.
// ======================================================

import {
  getCountryKnowledge,
  getSupportedKnowledgeCountries,
  type CountryKnowledge,
} from "./country-knowledge";

// ── Level definitions ────────────────────────────────────────────────────────

/**
 * Level 1: Teach only the learner's own country.
 * Level 2: Teach primarily the learner's own country;
 *          reference foreign systems only for useful comparison.
 * Level 3+: Learner may choose home country, United States,
 *           or any other supported country.
 */
export type CountrySelectionLevel = 1 | 2 | 3;

// ── Selection mode ───────────────────────────────────────────────────────────

export type CountrySelectionMode =
  | "home"         // Learner's own country
  | "us"           // United States
  | "other";       // Any other supported country

// ── Country selection context ─────────────────────────────────────────────────

export interface CountrySelectionContext {
  /** ISO code of the learner's home country */
  homeCountryIso: string;
  /** Level driving which options are available */
  level: CountrySelectionLevel;
  /** The country the learner has selected to learn about */
  selectedCountryIso: string;
  /** The selection mode chosen */
  mode: CountrySelectionMode;
}

// ── Available options per level ───────────────────────────────────────────────

export interface CountrySelectionOption {
  mode: CountrySelectionMode;
  isoCode: string;
  label: string;
  available: boolean;
}

/**
 * Returns the country selection options available to a learner at a given level.
 */
export function getCountrySelectionOptions(
  homeCountryIso: string,
  level: CountrySelectionLevel
): CountrySelectionOption[] {
  const homeKnowledge = getCountryKnowledge(homeCountryIso);
  const homeLabel = homeKnowledge?.country ?? `Your country (${homeCountryIso.toUpperCase()})`;

  const options: CountrySelectionOption[] = [
    {
      mode: "home",
      isoCode: homeCountryIso.toUpperCase(),
      label: `My country (${homeLabel})`,
      available: true,
    },
    {
      mode: "us",
      isoCode: "US",
      label: "United States",
      available: level >= 3,
    },
    {
      mode: "other",
      isoCode: "",
      label: "Another country",
      available: level >= 3,
    },
  ];

  return options;
}

// ── Context builder ───────────────────────────────────────────────────────────

/**
 * Builds a CountrySelectionContext, validating that the selected country
 * is accessible at the learner's current level.
 *
 * Throws if the selection is not permitted at the given level.
 */
export function buildCountrySelectionContext(options: {
  homeCountryIso: string;
  level: CountrySelectionLevel;
  requestedIso?: string;
  mode?: CountrySelectionMode;
}): CountrySelectionContext {
  const { homeCountryIso, level } = options;
  const home = homeCountryIso.toUpperCase();

  const mode = options.mode ?? "home";
  let selectedIso: string;

  switch (mode) {
    case "home":
      selectedIso = home;
      break;

    case "us":
      if (level < 3) {
        throw new Error(
          "United States content is only available at Level 3 and above."
        );
      }
      selectedIso = "US";
      break;

    case "other": {
      if (level < 3) {
        throw new Error(
          "Selecting another country is only available at Level 3 and above."
        );
      }
      if (!options.requestedIso) {
        throw new Error("A country ISO code is required when mode is 'other'.");
      }
      selectedIso = options.requestedIso.toUpperCase();
      break;
    }

    default:
      selectedIso = home;
  }

  return {
    homeCountryIso: home,
    level,
    selectedCountryIso: selectedIso,
    mode,
  };
}

// ── Knowledge loading ─────────────────────────────────────────────────────────

export interface ResolvedCountryContext {
  context: CountrySelectionContext;
  knowledge: CountryKnowledge | null;
  hasKnowledge: boolean;
  comparisonCountry: CountryKnowledge | null;
}

/**
 * Resolves the full country context for the AI coach, including
 * the country knowledge model for the selected country and, at
 * Level 2+, an optional home-country reference for comparison.
 */
export function resolveCountryContext(
  selectionContext: CountrySelectionContext
): ResolvedCountryContext {
  const knowledge = getCountryKnowledge(selectionContext.selectedCountryIso);

  let comparisonCountry: CountryKnowledge | null = null;

  if (
    selectionContext.level >= 2 &&
    selectionContext.selectedCountryIso !== selectionContext.homeCountryIso
  ) {
    comparisonCountry = getCountryKnowledge(selectionContext.homeCountryIso);
  }

  return {
    context: selectionContext,
    knowledge,
    hasKnowledge: Boolean(knowledge),
    comparisonCountry,
  };
}

// ── Coaching instruction builder ──────────────────────────────────────────────

/**
 * Builds a coaching instruction string from a resolved country context.
 * This string is injected into the AI session without embedding raw
 * country knowledge directly into the prompt template.
 *
 * The instruction is intentionally terse; the full knowledge object
 * is passed separately so AI logic is decoupled from content.
 */
export function buildCoachingInstruction(
  resolved: ResolvedCountryContext
): string {
  const { context, knowledge, hasKnowledge, comparisonCountry } = resolved;
  const countryLabel = knowledge?.country ?? context.selectedCountryIso;

  const lines: string[] = [];

  lines.push(
    `You are teaching business and financial concepts for: ${countryLabel}.`
  );

  if (!hasKnowledge) {
    lines.push(
      "Detailed country knowledge is not yet available for this country. " +
        "Teach general principles and note that local verification is recommended."
    );
    return lines.join(" ");
  }

  lines.push(
    `Use the ${countryLabel} legal framework, terminology, and entities throughout.`
  );

  if (context.level === 1) {
    lines.push(
      "Do not reference foreign legal systems, entity types, or tax authorities."
    );
  }

  if (context.level === 2 && comparisonCountry) {
    lines.push(
      `You may reference ${comparisonCountry.country} for useful comparison, but prioritize ${countryLabel}.`
    );
  }

  if (context.level >= 3) {
    lines.push(
      "The learner has selected a specific country and may request comparisons freely."
    );
  }

  return lines.join(" ");
}

// ── Utility ───────────────────────────────────────────────────────────────────

/**
 * Returns the list of country ISO codes with knowledge models available,
 * suitable for populating a "select another country" picker.
 */
export function getSelectableCountries(): Array<{
  isoCode: string;
  label: string;
}> {
  return getSupportedKnowledgeCountries().map((iso) => {
    const k = getCountryKnowledge(iso);
    return { isoCode: iso, label: k?.country ?? iso };
  });
}
