import { describe, expect, it } from 'vitest';
import { canadaJurisdictionLabel, canadaRequiresSubdivision, isCanadaSubdivision } from './canada';

describe('Canada jurisdiction foundation', () => {
  it('recognizes Canadian provinces and territories', () => {
    expect(isCanadaSubdivision('ON')).toBe(true);
    expect(isCanadaSubdivision('QC')).toBe(true);
    expect(isCanadaSubdivision('XX')).toBe(false);
  });

  it('keeps federal Canada distinct from a selected province', () => {
    expect(canadaJurisdictionLabel()).toContain('province/territory not selected');
    expect(canadaJurisdictionLabel('QC')).toBe('Canada — Quebec');
  });

  it('requires subdivision context for province-sensitive topics', () => {
    expect(canadaRequiresSubdivision(['personal-income-tax'])).toBe(true);
    expect(canadaRequiresSubdivision(['employment'])).toBe(true);
    expect(canadaRequiresSubdivision(['universal-budgeting'])).toBe(false);
  });
});
