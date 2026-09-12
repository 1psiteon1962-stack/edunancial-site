export const CANADA_SUBDIVISIONS = [
  ['AB','Alberta'],['BC','British Columbia'],['MB','Manitoba'],['NB','New Brunswick'],
  ['NL','Newfoundland and Labrador'],['NS','Nova Scotia'],['NT','Northwest Territories'],
  ['NU','Nunavut'],['ON','Ontario'],['PE','Prince Edward Island'],['QC','Quebec'],
  ['SK','Saskatchewan'],['YT','Yukon'],
] as const;

export type CanadaSubdivisionCode = (typeof CANADA_SUBDIVISIONS)[number][0];

export const CANADA_LAUNCH_TOPICS = [
  'personal-income-tax','corporate-income-tax','gst-hst','qst','provincial-sales-tax',
  'business-formation','employment','real-estate','capital-gains','registered-accounts',
] as const;

export function isCanadaSubdivision(value?: string): value is CanadaSubdivisionCode {
  return Boolean(value && CANADA_SUBDIVISIONS.some(([code]) => code === value));
}

/**
 * Canada is always treated as a federal + provincial/territorial jurisdiction.
 * Language is intentionally absent from this function: English/French selection
 * must never determine which law or tax system applies.
 */
export function canadaJurisdictionLabel(subdivisionCode?: string): string {
  if (!subdivisionCode) return 'Canada (federal; province/territory not selected)';
  const subdivision = CANADA_SUBDIVISIONS.find(([code]) => code === subdivisionCode);
  return subdivision ? `Canada — ${subdivision[1]}` : 'Canada (invalid province/territory)';
}

export function canadaRequiresSubdivision(topics: string[]): boolean {
  const subdivisionSensitive = new Set([
    'personal-income-tax','corporate-income-tax','provincial-sales-tax','qst',
    'business-formation','employment','real-estate',
  ]);
  return topics.some(topic => subdivisionSensitive.has(topic));
}
