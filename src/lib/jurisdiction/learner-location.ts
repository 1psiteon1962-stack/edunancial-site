import type { JurisdictionSelection } from './types';

export interface SessionLocationSignal {
  countryCode?: string | null;
  subdivisionCode?: string | null;
  source: 'edge' | 'ip' | 'device' | 'unknown';
  observedAt: string;
}

export interface ConfirmedLearnerJurisdiction {
  countryCode: string;
  subdivisionCode?: string;
  confirmedAt: string;
}

export interface LearnerJurisdictionResolution {
  selection: JurisdictionSelection;
  requiresConfirmation: boolean;
  sessionLocationDiffers: boolean;
}

const normalize = (value?: string | null) => value?.trim().toUpperCase() || undefined;

/** Session geolocation is a useful signal, never the source of substantive law. */
export function resolveLearnerJurisdiction(input: {
  confirmed?: ConfirmedLearnerJurisdiction | null;
  session?: SessionLocationSignal | null;
  language: string;
}): LearnerJurisdictionResolution {
  const confirmedCountry = normalize(input.confirmed?.countryCode);
  const confirmedSubdivision = normalize(input.confirmed?.subdivisionCode);
  const sessionCountry = normalize(input.session?.countryCode);
  const sessionSubdivision = normalize(input.session?.subdivisionCode);

  if (!confirmedCountry) {
    return {
      selection: { countryCode: '', subdivisionCode: undefined, language: input.language },
      requiresConfirmation: true,
      sessionLocationDiffers: false,
    };
  }

  return {
    selection: { countryCode: confirmedCountry, subdivisionCode: confirmedSubdivision, language: input.language },
    requiresConfirmation: false,
    sessionLocationDiffers: Boolean(
      sessionCountry && (
        sessionCountry !== confirmedCountry ||
        (sessionCountry === confirmedCountry && sessionSubdivision && confirmedSubdivision && sessionSubdivision !== confirmedSubdivision)
      )
    ),
  };
}

/** Geolocation may prefill signup, but the learner must confirm it. */
export function suggestedJurisdictionFromSession(session?: SessionLocationSignal | null): {
  countryCode?: string;
  subdivisionCode?: string;
} {
  return {
    countryCode: normalize(session?.countryCode),
    subdivisionCode: normalize(session?.subdivisionCode),
  };
}
