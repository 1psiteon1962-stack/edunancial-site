export interface ProfitAnalysis{

grossRevenue:number;

netRevenue:number;

expenses:number;

profit:number;

margin:number;

}

export function calculateMargin(

profit:number,

revenue:number

){

if(revenue===0)return 0;

return(profit/revenue)*100;

}
