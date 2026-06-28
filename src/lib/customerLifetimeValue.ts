export interface CustomerLifetimeValue{

customerId:string;

totalOrders:number;

grossRevenue:number;

netRevenue:number;

profit:number;

ltv:number;

firstPurchase:string;

lastPurchase:string;

active:boolean;

}

export function calculateLTV(

revenue:number,

customers:number

){

if(customers===0)return 0;

return revenue/customers;

}
