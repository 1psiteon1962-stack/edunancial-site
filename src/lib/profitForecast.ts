import { KPIRecord } from "./kpiTypes";

export interface ProfitForecast{

currentProfit:number;

projectedMonthly:number;

projectedQuarterly:number;

projectedAnnual:number;

}

export function forecastProfit(
kpi:KPIRecord,
growth:number
):ProfitForecast{

const factor=1+(growth/100);

return{

currentProfit:kpi.netProfit,

projectedMonthly:Number(
(kpi.netProfit*factor).toFixed(2)
),

projectedQuarterly:Number(
(kpi.netProfit*Math.pow(factor,3)).toFixed(2)
),

projectedAnnual:Number(
(kpi.netProfit*Math.pow(factor,12)).toFixed(2)
)

};

}
