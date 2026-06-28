export interface GlobalKPIHierarchy {

  global: string;

  continent: string;

  region: string;

  country: string;

  stateProvince?: string;

  city?: string;

  office?: string;

}

export interface KPIRollup {

  grossRevenue:number;

  refunds:number;

  netRevenue:number;

  grossProfit:number;

  operatingExpense:number;

  netProfit:number;

  activeMembers:number;

  newMembers:number;

  cancelledMembers:number;

  activeCourses:number;

  completedCourses:number;

  ebooksSold:number;

  downloads:number;

}
