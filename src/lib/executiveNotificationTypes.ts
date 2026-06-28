export interface ExecutiveNotification{

id:string;

title:string;

message:string;

priority:
"low"|
"medium"|
"high"|
"critical";

read:boolean;

created:string;

link?:string;

}
