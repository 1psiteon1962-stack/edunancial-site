import { canadaRequiresSubdivision, isCanadaSubdivision } from './canada';
import { isUnitedStatesSubdivision, unitedStatesRequiresSubdivision } from './united-states';
import type { JurisdictionSelection } from './types';

export interface JurisdictionPolicyResult {
  usable: boolean;
  reason?: string;
  selection: JurisdictionSelection;
}

export function evaluateJurisdictionSelection(
  selection: JurisdictionSelection,
  topics: string[],
): JurisdictionPolicyResult {
  const countryCode = selection.countryCode.trim().toUpperCase();
  const subdivisionCode = selection.subdivisionCode?.trim().toUpperCase();
  const normalized = { ...selection, countryCode, subdivisionCode };

  if (!countryCode) {
    return { usable: false, selection: normalized, reason: 'A jurisdiction must be selected before jurisdiction-specific guidance can be provided.' };
  }

  if (countryCode === 'CA') {
    if (subdivisionCode && !isCanadaSubdivision(subdivisionCode)) {
      return { usable: false, selection: normalized, reason: 'Invalid Canadian province or territory.' };
    }
    if (canadaRequiresSubdivision(topics) && !subdivisionCode) {
      return {
        usable: false,
        selection: normalized,
        reason: 'This Canadian topic requires a province or territory before jurisdiction-specific guidance can be provided.',
      };
    }
  }

  if (countryCode === 'US') {
    if (subdivisionCode && !isUnitedStatesSubdivision(subdivisionCode)) {
      return { usable: false, selection: normalized, reason: 'Invalid United States state, district, or territory.' };
    }
    if (unitedStatesRequiresSubdivision(topics) && !subdivisionCode) {
      return {
        usable: false,
        selection: normalized,
        reason: 'This United States topic requires a state, district, or territory before state-specific guidance can be provided.',
      };
    }
  }

  return { usable: true, selection: normalized };
}
