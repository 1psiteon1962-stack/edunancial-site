export function getFounderLevel(profile: {
  revenue: number;
  hasEmployees: boolean;
  hasHoldingCompany: boolean;
}) {
  if (profile.hasHoldingCompany) return 5;
  if (profile.hasEmployees && profile.revenue > 1000000) return 4;
  if (profile.revenue > 100000) return 3;
  if (profile.revenue > 10000) return 2;
  return 1;
}
