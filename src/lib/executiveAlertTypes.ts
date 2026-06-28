export interface ExecutiveAlert{

id:string;

title:string;

message:string;

severity:
"info"|
"warning"|
"critical";

category:
"sales"|
"marketing"|
"finance"|
"operations";

region:string;

country:string;

createdAt:string;

resolved:boolean;

}
