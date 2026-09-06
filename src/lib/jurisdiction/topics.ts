const TRACK_DEFAULT_TOPICS: Record<string, string[]> = {
  RED: ['real-estate'],
  WHITE: ['investing'],
  BLUE: ['business-formation'],
  GREEN: ['personal-income-tax'],
  GOLD: ['investing'],
  PURPLE: ['legal'],
  ORANGE: ['business'],
  BLACK: ['business'],
};

const KEYWORDS: Array<[RegExp, string]> = [
  [/income tax|taxation|taxes|tax\b/i, 'personal-income-tax'],
  [/corporate tax/i, 'corporate-income-tax'],
  [/gst|hst/i, 'gst-hst'],
  [/qst/i, 'qst'],
  [/sales tax/i, 'provincial-sales-tax'],
  [/employment|employee|worker|payroll/i, 'employment'],
  [/real estate|property|rental|landlord|tenant/i, 'real-estate'],
  [/company|corporation|llc|entity|formation|business structure/i, 'business-formation'],
  [/capital gain/i, 'capital-gains'],
  [/contract|law|legal|liability|regulation/i, 'legal'],
  [/stock|bond|fund|investment|investing/i, 'investing'],
];

export function inferJurisdictionTopics(input: {
  track?: string | null;
  lessonId?: string | null;
  topic?: string | null;
  message?: string | null;
}): string[] {
  const text = [input.lessonId, input.topic, input.message].filter(Boolean).join(' ');
  const inferred = KEYWORDS.filter(([pattern]) => pattern.test(text)).map(([, topic]) => topic);
  if (inferred.length) return [...new Set(inferred)];
  return TRACK_DEFAULT_TOPICS[input.track?.toUpperCase() ?? ''] ?? ['general-financial-education'];
}
