export interface RenewalNotification{

providerId:string;

daysBeforeExpiration:number;

emailSent:boolean;

reminderType:
"LICENSE"|
"INSURANCE"|
"MEMBERSHIP";

}
