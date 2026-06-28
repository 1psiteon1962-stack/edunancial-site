import { KPIRecord } from "./kpiTypes";

export interface CountrySummary {

  country:string;

  grossRevenue:number;

  netProfit:number;

  members:number;

  ebooks:number;

  courses:number;

}

export function summarizeCountry(
country:string,
records:KPIRecord[]
):CountrySummary{

const filtered=records.filter(
r=>r.country===country
);

return{

country,

grossRevenue:filtered.reduce(
(a,b)=>a+b.grossRevenue,0
),

netProfit:filtered.reduce(
(a,b)=>a+b.netProfit,0
),

members:filtered.reduce(
(a,b)=>a+b.activeUsers,0
),

ebooks:filtered.reduce(
(a,b)=>a+b.downloads,0
),

courses:filtered.reduce(
(a,b)=>a+b.courseEnrollments,0
)

};

}
