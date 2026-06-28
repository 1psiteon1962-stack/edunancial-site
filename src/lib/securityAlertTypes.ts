export interface SecurityAlert{

id:string;

title:string;

description:string;

severity:
"low"|
"medium"|
"high"|
"critical";

status:
"open"|
"investigating"|
"resolved";

createdAt:string;

}
