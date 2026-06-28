import { KPIRecord } from "./kpiTypes";

export interface ExecutiveAlert{

severity:"INFO"|"WARNING"|"CRITICAL";

message:string;

}

export function generateExecutiveAlerts(
kpi:KPIRecord
):ExecutiveAlert[]{

const alerts:ExecutiveAlert[]=[];

if(kpi.netProfit<0){

alerts.push({

severity:"CRITICAL",

message:"Region is operating at a loss."

});

}

if(kpi.refunds>kpi.grossRevenue*0.10){

alerts.push({

severity:"WARNING",

message:"Refund rate exceeds 10%."

});

}

if(kpi.conversionRate<2){

alerts.push({

severity:"WARNING",

message:"Conversion rate below target."

});

}

if(kpi.customerLifetimeValue<100){

alerts.push({

severity:"INFO",

message:"Increase customer lifetime value."

});

}

return alerts;

}
