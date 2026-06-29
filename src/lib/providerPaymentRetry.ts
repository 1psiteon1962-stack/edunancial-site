export interface PaymentRetry{

providerId:string;

attempt:number;

scheduledDate:string;

completed:boolean;

successful:boolean;

emailSent:boolean;

}
