export type BudgetCalculatorInputs = {
  monthlyIncome: number;
  housing: number;
  utilities: number;
  food: number;
  transportation: number;
  insurance: number;
  debtPayments: number;
  savings: number;
  otherExpenses: number;
};

export type BudgetCalculatorResult = {
  totalIncome: number;
  totalExpenses: number;
  remainingCashFlow: number;
  savingsRate: number;
  debtToIncome: number;
  messages: string[];
};

export function calculateBudgetSummary(
  input: BudgetCalculatorInputs,
): BudgetCalculatorResult {
  const totalIncome = clampToCurrency(input.monthlyIncome);
  const totalExpenses = clampToCurrency(
    input.housing +
      input.utilities +
      input.food +
      input.transportation +
      input.insurance +
      input.debtPayments +
      input.savings +
      input.otherExpenses,
  );

  const remainingCashFlow = clampToCurrency(totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? clampToRate((input.savings / totalIncome) * 100) : 0;
  const debtToIncome =
    totalIncome > 0 ? clampToRate((input.debtPayments / totalIncome) * 100) : 0;

  const messages: string[] = [];

  if (remainingCashFlow > 0) {
    messages.push("You have positive cash flow. Keep building momentum by staying consistent.");
  } else if (remainingCashFlow < 0) {
    messages.push(
      "Your cash flow is negative. Review your expenses and look for categories to adjust.",
    );
  } else {
    messages.push("Your cash flow is break-even. Small expense reductions can create a positive buffer.");
  }

  if (savingsRate < 10) {
    messages.push("Your savings rate is below 10%. Aim to increase savings gradually over time.");
  } else if (savingsRate >= 20) {
    messages.push("Excellent savings rate. You are building strong financial resilience.");
  }

  return {
    totalIncome,
    totalExpenses,
    remainingCashFlow,
    savingsRate,
    debtToIncome,
    messages,
  };
}

function clampToCurrency(value: number): number {
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}

function clampToRate(value: number): number {
  return Number.isFinite(value) ? Number(value.toFixed(1)) : 0;
}
