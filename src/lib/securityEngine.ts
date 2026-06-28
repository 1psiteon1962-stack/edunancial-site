import { LoginAttempt } from "./loginAttemptTypes";
import { SecurityEvent } from "./securityEventTypes";

export function detectBruteForce(
attempts:LoginAttempt[],
email:string,
limit=5
):boolean{

const failed=attempts.filter(a=>
a.email===email &&
!a.successful
);

return failed.length>=limit;

}

export function createSecurityEvent(
message:string,
level:"info"|"warning"|"high"|"critical"
):SecurityEvent{

return{
id:crypto.randomUUID(),
timestamp:new Date().toISOString(),
level,
category:"authentication",
message,
resolved:false
};

}
