export type ContributionFrequency = "weekly" | "biweekly" | "monthly" | "annual";

const PERIODS_PER_YEAR: Record<ContributionFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  annual: 1,
};

export interface InvestmentGrowthInput {
  startingBalance: number;
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  annualReturnPercent: number;
  years: number;
}

export interface InvestmentGrowthYear {
  year: number;
  contributed: number;
  growth: number;
  endingBalance: number;
}

export interface InvestmentGrowthResult {
  totalContributed: number;
  totalGrowth: number;
  endingBalance: number;
  yearly: InvestmentGrowthYear[];
}

export function calculateInvestmentGrowth(input: InvestmentGrowthInput): InvestmentGrowthResult {
  const periodsPerYear = PERIODS_PER_YEAR[input.contributionFrequency];
  const years = Math.max(0, Math.floor(input.years));
  const annualRate = input.annualReturnPercent / 100;
  const periodicRate = Math.pow(1 + annualRate, 1 / periodsPerYear) - 1;
  let balance = Math.max(0, input.startingBalance);
  let totalContributed = balance;
  const yearly: InvestmentGrowthYear[] = [];

  for (let year = 1; year <= years; year += 1) {
    for (let period = 0; period < periodsPerYear; period += 1) {
      balance *= 1 + periodicRate;
      const contribution = Math.max(0, input.contributionAmount);
      balance += contribution;
      totalContributed += contribution;
    }
    yearly.push({
      year,
      contributed: totalContributed,
      growth: balance - totalContributed,
      endingBalance: balance,
    });
  }

  return {
    totalContributed,
    totalGrowth: balance - totalContributed,
    endingBalance: balance,
    yearly,
  };
}

export function calculateMilestones(input: Omit<InvestmentGrowthInput, "years">, years = [10, 20, 30, 40]) {
  return years.map((year) => ({ year, ...calculateInvestmentGrowth({ ...input, years: year }) }));
}
