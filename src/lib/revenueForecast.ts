import { KPIRecord } from "./kpiTypes";

export interface RevenueForecast {

  currentRevenue:number;

  projected30Days:number;

  projected90Days:number;

  projectedYear:number;

}

export function forecastRevenue(
kpi:KPIRecord,
monthlyGrowth:number
):RevenueForecast{

const current=kpi.netRevenue;

const growth=1+(monthlyGrowth/100);

return{

currentRevenue:current,

projected30Days:Number(
(current*growth).toFixed(2)
),

projected90Days:Number(
(current*Math.pow(growth,3)).toFixed(2)
),

projectedYear:Number(
(current*Math.pow(growth,12)).toFixed(2)
)

};

}
