import { canadaRequiresSubdivision, isCanadaSubdivision } from './canada';
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

  return { usable: true, selection: normalized };
}
