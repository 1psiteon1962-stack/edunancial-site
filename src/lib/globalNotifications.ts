export interface GlobalNotification{

id:string;

title:string;

message:string;

severity:"INFO"|"WARNING"|"CRITICAL";

created:string;

read:boolean;

}

export function createNotification(

notification:GlobalNotification

){

return notification;

}
