export interface CartItem{

id:string;

productId:string;

title:string;

type:"book"|"course"|"membership";

price:number;

quantity:number;

subtotal:number;

}
