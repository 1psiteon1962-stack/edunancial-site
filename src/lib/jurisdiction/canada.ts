export const CANADA_SUBDIVISIONS = [
  ['AB','Alberta'],['BC','British Columbia'],['MB','Manitoba'],['NB','New Brunswick'],
  ['NL','Newfoundland and Labrador'],['NS','Nova Scotia'],['NT','Northwest Territories'],
  ['NU','Nunavut'],['ON','Ontario'],['PE','Prince Edward Island'],['QC','Quebec'],
  ['SK','Saskatchewan'],['YT','Yukon'],
] as const;

export type CanadaSubdivisionCode = (typeof CANADA_SUBDIVISIONS)[number][0];

const SUBDIVISION_SENSITIVE_TOPICS = new Set([
  'personal-income-tax','corporate-income-tax','provincial-sales-tax','qst',
  'business-formation','employment','real-estate',
]);

export function isCanadaSubdivision(value?: string): value is CanadaSubdivisionCode {
  return Boolean(value && CANADA_SUBDIVISIONS.some(([code]) => code === value));
}

export function canadaRequiresSubdivision(topics: string[]): boolean {
  return topics.some(topic => SUBDIVISION_SENSITIVE_TOPICS.has(topic));
}

export function canadaJurisdictionLabel(subdivisionCode?: string): string {
  if (!subdivisionCode) return 'Canada (federal; province/territory not selected)';
  const subdivision = CANADA_SUBDIVISIONS.find(([code]) => code === subdivisionCode);
  return subdivision ? `Canada — ${subdivision[1]}` : 'Canada (invalid province/territory)';
}
