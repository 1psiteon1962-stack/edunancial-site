export interface PaymentRecoverySchedule{

attempt:number;

daysAfterFailure:number;

sendReminder:boolean;

retryCharge:boolean;

}

export const PAYMENT_RECOVERY:PaymentRecoverySchedule[]=[

{attempt:1,daysAfterFailure:0,sendReminder:true,retryCharge:false},

{attempt:2,daysAfterFailure:3,sendReminder:true,retryCharge:true},

{attempt:3,daysAfterFailure:7,sendReminder:true,retryCharge:true}

];
