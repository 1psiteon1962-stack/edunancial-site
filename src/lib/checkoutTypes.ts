export interface Checkout{

userId:string;

subtotal:number;

tax:number;

discount:number;

total:number;

currency:string;

status:"pending"|"paid"|"failed";

}
