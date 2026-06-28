import { KPIRecord } from "./kpiTypes";

export interface BusinessHealth{

score:number;

status:string;

}

export function evaluateBusinessHealth(
kpi:KPIRecord
):BusinessHealth{

let score=100;

if(kpi.netProfit<0){

score-=40;

}

if(kpi.conversionRate<2){

score-=15;

}

if(kpi.refunds>kpi.netRevenue*0.08){

score-=15;

}

if(kpi.courseCompletions<50){

score-=10;

}

if(kpi.activeUsers<100){

score-=10;

}

return{

score,

status:
score>=90
?"Excellent"
:score>=75
?"Healthy"
:score>=60
?"Needs Attention"
:"Critical"

};

}
