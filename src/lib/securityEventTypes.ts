export type SecurityLevel="info"|"warning"|"high"|"critical";

export interface SecurityEvent{
id:string;
timestamp:string;
level:SecurityLevel;
category:string;
message:string;
userId?:string;
ip?:string;
country?:string;
resolved:boolean;
}
