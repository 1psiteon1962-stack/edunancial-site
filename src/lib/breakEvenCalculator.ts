export function breakEvenPoint(

fixedCosts:number,

price:number,

variableCost:number

){

if(price<=variableCost)return 0;

return Math.ceil(

fixedCosts/

(price-variableCost)

);

}
