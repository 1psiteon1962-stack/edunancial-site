export interface EmailSubscriber{

id:string;

firstName:string;

lastName:string;

email:string;

country:string;

region:string;

language:string;

leadMagnet:string;

source:string;

subscribedAt:string;

status:"active"|"unsubscribed";

lifetimeValue:number;

customerAcquisitionCost:number;

}
