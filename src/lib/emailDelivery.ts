export interface EmailDelivery{

id:string;

subscriberId:string;

templateId:string;

subject:string;

sent:boolean;

opened:boolean;

clicked:boolean;

sentAt:string;

openedAt?:string;

clickedAt?:string;

}

export function markOpened(
email:EmailDelivery
){

email.opened=true;

email.openedAt=new Date().toISOString();

return email;

}

export function markClicked(
email:EmailDelivery
){

email.clicked=true;

email.clickedAt=new Date().toISOString();

return email;

}
