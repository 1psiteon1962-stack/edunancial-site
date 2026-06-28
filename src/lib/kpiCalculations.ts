import { KPIRecord } from "./kpiTypes";

export function calculateProfitMargin(record: KPIRecord) {

  if (record.netRevenue === 0) return 0;

  return Number(
    (
      (record.netProfit / record.netRevenue) * 100
    ).toFixed(2)
  );

}

export function calculateRefundRate(record: KPIRecord) {

  if (record.grossRevenue === 0) return 0;

  return Number(
    (
      (record.refunds / record.grossRevenue) * 100
    ).toFixed(2)
  );

}

export function calculateCompletionRate(
  completed:number,
  enrolled:number
){

  if(enrolled===0) return 0;

  return Number(
    ((completed/enrolled)*100).toFixed(2)
  );

}
