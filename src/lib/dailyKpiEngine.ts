export interface DailyKPI{

date:string;

users:number;

customers:number;

orders:number;

revenue:number;

expenses:number;

profit:number;

}

export function calculateProfit(

revenue:number,

expenses:number

){

return revenue-expenses;

}
