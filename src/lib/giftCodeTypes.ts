export interface GiftCode{
id:string;
code:string;
productId:string;
redeemed:boolean;
redeemedBy?:string;
expires:string;
}
