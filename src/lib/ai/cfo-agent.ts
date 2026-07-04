export interface FinancialSummary {

  monthlyRevenue: number;

  monthlyExpenses: number;

  monthlyProfit: number;

  cashAvailable: number;

}

export function getFinancialSummary(): FinancialSummary {

  return {

    monthlyRevenue: 0,

    monthlyExpenses: 0,

    monthlyProfit: 0,

    cashAvailable: 0,

  };

}
