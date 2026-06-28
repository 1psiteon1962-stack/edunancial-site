export interface WeeklyKPI{

week:string;

users:number;

customers:number;

orders:number;

revenue:number;

expenses:number;

profit:number;

growth:number;

}

export function growthRate(

current:number,

previous:number

){

if(previous===0)return 0;

return((current-previous)/previous)*100;

}
