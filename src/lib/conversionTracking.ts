export interface Conversion{

subscriberId:string;

campaignId:string;

leadMagnetId:string;

productId:string;

revenue:number;

convertedAt:string;

}

export function conversionRate(

visitors:number,

customers:number

){

if(visitors===0)return 0;

return(customers/visitors)*100;

}
