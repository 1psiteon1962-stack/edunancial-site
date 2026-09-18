export const US_SUBDIVISIONS = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC','PR','GU','VI','AS','MP'
] as const;

const SUBDIVISION_SENSITIVE_TOPICS = new Set([
  'personal-income-tax',
  'corporate-income-tax',
  'provincial-sales-tax',
  'real-estate',
  'business-formation',
  'employment',
  'legal',
]);

export function isUnitedStatesSubdivision(code: string): boolean {
  return (US_SUBDIVISIONS as readonly string[]).includes(code.trim().toUpperCase());
}

export function unitedStatesRequiresSubdivision(topics: string[]): boolean {
  return topics.some(topic => SUBDIVISION_SENSITIVE_TOPICS.has(topic));
}
