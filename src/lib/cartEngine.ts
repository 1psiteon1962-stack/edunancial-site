import {CartItem} from "./cartTypes";

export function cartTotal(items:CartItem[]){

return items.reduce(

(sum,item)=>sum+item.subtotal,

0

);

}
