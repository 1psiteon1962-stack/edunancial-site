export interface Coupon{
id:string;
code:string;
discount:number;
type:"percent"|"fixed";
active:boolean;
expires:string;
uses:number;
}
