export interface TreasurySnapshot {

  operatingCash: number;

  reserveCash: number;

  monthlyRevenue: number;

  monthlyExpenses: number;

  availableInvestmentCapital: number;

}

export function getTreasurySnapshot(): TreasurySnapshot {

  return {

    operatingCash: 0,

    reserveCash: 0,

    monthlyRevenue: 0,

    monthlyExpenses: 0,

    availableInvestmentCapital: 0,

  };

}
