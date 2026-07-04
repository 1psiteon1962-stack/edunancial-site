export interface ExecutiveSummary {

  revenueAlert: string;

  operationsAlert: string;

  marketingAlert: string;

  expansionAlert: string;

}

export function getExecutiveSummary(): ExecutiveSummary {

  return {

    revenueAlert:
      "No alerts.",

    operationsAlert:
      "No alerts.",

    marketingAlert:
      "No alerts.",

    expansionAlert:
      "No alerts.",

  };

}
