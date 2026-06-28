export interface SecurityIncident{

id:string;

title:string;

category:string;

severity:
"low"|
"medium"|
"high"|
"critical";

assignedTo?:string;

status:
"open"|
"investigating"|
"resolved";

createdAt:string;

}
