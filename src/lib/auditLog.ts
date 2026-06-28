export interface AuditLog{

id:string;

userId:string;

role:string;

region:string;

country:string;

action:string;

entity:string;

entityId:string;

timestamp:string;

ipAddress:string;

}

export function createAuditLog(
entry:AuditLog
){

return{

...entry

};

}
