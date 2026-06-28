export interface RetentionAnalytics{

customerId:string;

firstPurchase:string;

lastPurchase:string;

purchases:number;

daysActive:number;

lifetimeRevenue:number;

active:boolean;

}

export function retentionPercent(

active:number,

total:number

){

if(total===0)return 0;

return(active/total)*100;

}
