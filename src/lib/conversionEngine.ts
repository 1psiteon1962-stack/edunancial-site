export function conversionRate(

visitors:number,

customers:number

){

if(visitors===0)return 0;

return(customers/visitors)*100;

}
