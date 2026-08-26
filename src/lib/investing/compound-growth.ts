export type ContributionFrequency = "weekly" | "biweekly" | "monthly" | "annual";

export type InvestmentGrowthInput = {
  startingBalance: number;
  contributionAmount: number;
  contributionFrequency: ContributionFrequency;
  annualReturnPercent: number;
  years: number;
};

export type InvestmentGrowthYear = {
  year: number;
  contributed: number;
  growth: number;
  endingBalance: number;
};

const PERIODS: Record<ContributionFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
  annual: 1,
};

function money(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateInvestmentGrowth(input: InvestmentGrowthInput) {
  const startingBalance = Math.max(0, Number(input.startingBalance) || 0);
  const contributionAmount = Math.max(0, Number(input.contributionAmount) || 0);
  const years = Math.max(1, Math.min(80, Math.floor(Number(input.years) || 1)));
  const annualReturn = Math.max(-99.99, Math.min(100, Number(input.annualReturnPercent) || 0)) / 100;
  const periodsPerYear = PERIODS[input.contributionFrequency] ?? 12;
  const periodicRate = Math.pow(1 + annualReturn, 1 / periodsPerYear) - 1;
  let balance = startingBalance;
  let contributed = startingBalance;
  const yearly: InvestmentGrowthYear[] = [];

  for (let year = 1; year <= years; year += 1) {
    for (let period = 0; period < periodsPerYear; period += 1) {
      balance *= 1 + periodicRate;
      balance += contributionAmount;
      contributed += contributionAmount;
    }
    yearly.push({
      year,
      contributed: money(contributed),
      growth: money(balance - contributed),
      endingBalance: money(balance),
    });
  }

  return {
    startingBalance: money(startingBalance),
    totalContributed: money(contributed),
    totalGrowth: money(balance - contributed),
    endingBalance: money(balance),
    yearly,
  };
}

export function calculateMilestones(
  input: Omit<InvestmentGrowthInput, "years">,
  years: number[] = [10, 20, 30, 40],
) {
  return years.map((year) => ({ year, ...calculateInvestmentGrowth({ ...input, years: year }) }));
}
