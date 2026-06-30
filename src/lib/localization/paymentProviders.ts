export interface PaymentProvider{

name:string;

countries:string[];

currencies:string[];

enabled:boolean;

}

export const PaymentProviders:PaymentProvider[]=[];
