export type MembershipMix = { basic: number; pro: number; gold: number };

export const MONTHLY_PRICE = { basic: 39.99, pro: 69.99, gold: 99.99 } as const;
export const LESSONS_PER_LEVEL = 400;
export const MINUTES_PER_LESSON = 35;

export function weightedMonthlyArpu(mix: MembershipMix): number {
  const total = mix.basic + mix.pro + mix.gold;
  if (total <= 0) return 0;
  return (
    mix.basic * MONTHLY_PRICE.basic +
    mix.pro * MONTHLY_PRICE.pro +
    mix.gold * MONTHLY_PRICE.gold
  ) / total;
}

export function activePaidMembersForAnnualRevenue(targetUsd: number, mix: MembershipMix): number {
  const annualArpu = weightedMonthlyArpu(mix) * 12;
  return annualArpu > 0 ? Math.ceil(targetUsd / annualArpu) : 0;
}

export function monthsFromStartingMembers(params: {
  startingMembers: number;
  targetMembers: number;
  monthlyNetGrowthRate: number;
}): number | null {
  const { startingMembers, targetMembers, monthlyNetGrowthRate } = params;
  if (startingMembers <= 0 || targetMembers <= 0 || monthlyNetGrowthRate <= 0) return null;
  if (startingMembers >= targetMembers) return 0;
  return Math.log(targetMembers / startingMembers) / Math.log(1 + monthlyNetGrowthRate);
}

export function levelStudyLoad(lessonsPerWeek: number) {
  if (lessonsPerWeek <= 0) return null;
  const totalMinutes = LESSONS_PER_LEVEL * MINUTES_PER_LESSON;
  const weeks = LESSONS_PER_LEVEL / lessonsPerWeek;
  return {
    hoursPerLevel: totalMinutes / 60,
    weeksPerLevel: weeks,
    yearsPerLevel: weeks / 52,
  };
}

export const DEFAULT_REVENUE_SCENARIOS = [
  { name: "Conservative mix", mix: { basic: 60, pro: 30, gold: 10 } },
  { name: "Base mix", mix: { basic: 40, pro: 40, gold: 20 } },
  { name: "Premium mix", mix: { basic: 25, pro: 40, gold: 35 } },
] as const;

export const REVENUE_MILESTONES_USD = [50_000_000, 100_000_000, 150_000_000] as const;
