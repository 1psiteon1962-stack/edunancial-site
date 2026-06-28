export interface EmailVerification{

subscriberId:string;

email:string;

token:string;

verified:boolean;

expires:string;

}

export function verified(
record:EmailVerification
){

record.verified=true;

return record;

}
