export type FinancialStatementLine = { key: string; value: number; formula?: string };
export type FinancialStatement = { key: string; lines: FinancialStatementLine[] };

export const financialStatementExample = {
  income: { key: "incomeStatement", lines: [
    { key: "revenue", value: 1000000, formula: "20000 × 50" },
    { key: "cogs", value: -600000 }, { key: "grossProfit", value: 400000, formula: "1000000 - 600000" },
    { key: "operatingExpenses", value: -250000 }, { key: "operatingIncome", value: 150000 },
    { key: "interest", value: -20000 }, { key: "taxes", value: -30000 }, { key: "netIncome", value: 100000 },
  ] },
  balance: { key: "balanceSheet", lines: [
    { key: "cash", value: 18000 }, { key: "accountsReceivable", value: 140000 }, { key: "inventory", value: 120000 },
    { key: "equipment", value: 322000 }, { key: "liabilities", value: 350000 }, { key: "equity", value: 250000 },
  ] },
  cashFlow: { key: "cashFlowStatement", lines: [
    { key: "netIncome", value: 100000 }, { key: "workingCapital", value: -52000 }, { key: "equipmentPurchases", value: -70000 },
    { key: "financing", value: 30000 }, { key: "debtRepayment", value: -15000 }, { key: "endingCash", value: 18000 },
  ] },
} satisfies Record<string, FinancialStatement>;

export function modelIncomeStatement(revenue: number, cogs: number, operatingExpenses: number) {
  const grossProfit = revenue - cogs;
  const operatingIncome = grossProfit - operatingExpenses;
  return { revenue, cogs, grossProfit, operatingExpenses, operatingIncome, grossMargin: revenue ? grossProfit / revenue : 0 };
}
