export interface LeadCapture{

id:string;

firstName:string;

lastName:string;

email:string;

country:string;

region:string;

language:string;

leadMagnetId:string;

source:string;

createdAt:string;

verified:boolean;

}

export function newLead(
lead:LeadCapture
){

return lead;

}
