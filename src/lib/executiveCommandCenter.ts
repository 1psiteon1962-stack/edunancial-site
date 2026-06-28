import { KPIRecord } from "./kpiTypes";

export interface ExecutiveCommandCenter {

  totalRevenue:number;

  totalProfit:number;

  totalMembers:number;

  totalDownloads:number;

  totalCountries:number;

  totalRegions:number;

}

export function buildExecutiveCommandCenter(
records: KPIRecord[]
): ExecutiveCommandCenter {

return {

totalRevenue: records.reduce((a,b)=>a+b.netRevenue,0),

totalProfit: records.reduce((a,b)=>a+b.netProfit,0),

totalMembers: records.reduce((a,b)=>a+b.activeUsers,0),

totalDownloads: records.reduce((a,b)=>a+b.downloads,0),

totalCountries:new Set(records.map(r=>r.country)).size,

totalRegions:new Set(records.map(r=>r.region)).size

};

}
