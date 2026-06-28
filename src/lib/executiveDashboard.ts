import { KPIRecord } from "./kpiTypes";

export interface ExecutiveDashboard{

totalRevenue:number;

totalProfit:number;

profitMargin:number;

activeMembers:number;

ebooksSold:number;

coursesSold:number;

downloads:number;

continents:number;

countries:number;

}

export function buildExecutiveDashboard(
records:KPIRecord[]
):ExecutiveDashboard{

const revenue=records.reduce(
(a,b)=>a+b.netRevenue,0
);

const profit=records.reduce(
(a,b)=>a+b.netProfit,0
);

return{

totalRevenue:revenue,

totalProfit:profit,

profitMargin:
revenue===0
?0
:Number(((profit/revenue)*100).toFixed(2)),

activeMembers:records.reduce(
(a,b)=>a+b.activeUsers,0
),

ebooksSold:records.reduce(
(a,b)=>a+b.downloads,0
),

coursesSold:records.reduce(
(a,b)=>a+b.courseEnrollments,0
),

downloads:records.reduce(
(a,b)=>a+b.downloads,0
),

continents:new Set(
records.map(r=>r.continent)
).size,

countries:new Set(
records.map(r=>r.country)
).size

};

}
