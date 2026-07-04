export interface SalesPipeline {

  leads: number;

  qualified: number;

  proposals: number;

  closed: number;

}

export function getSalesPipeline(): SalesPipeline {

  return {

    leads: 0,

    qualified: 0,

    proposals: 0,

    closed: 0,

  };

}
