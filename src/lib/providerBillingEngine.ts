export enum BillingStatus{

CURRENT="CURRENT",

PAST_DUE="PAST_DUE",

PAYMENT_PENDING="PAYMENT_PENDING",

SUSPENDED="SUSPENDED",

CANCELLED="CANCELLED"

}

export interface ProviderBilling{

providerId:string;

status:BillingStatus;

renewalDate:string;

lastPayment:string;

nextAttempt?:string;

}
