export interface EmailCampaign{

id:string;

name:string;

subject:string;

fromName:string;

replyTo:string;

scheduledDate:string;

status:
"draft"|
"scheduled"|
"sending"|
"completed";

subscribers:number;

opens:number;

clicks:number;

conversions:number;

revenue:number;

}
