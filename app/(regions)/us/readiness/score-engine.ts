export function calculateReadiness(profile: {
  revenue: number;
  employees: number;
  hasLLC: boolean;
  hasHoldingCompany: boolean;
}) {
  let score = 0;

  if (profile.revenue > 10000) score += 20;
  if (profile.revenue > 100000) score += 30;
  if (profile.employees > 0) score += 15;
  if (profile.hasLLC) score += 15;
  if (profile.hasHoldingCompany) score += 20;

  return Math.min(score, 100);
}
