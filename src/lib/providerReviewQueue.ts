export interface ProviderReview{

id:string;

providerId:string;

reason:string;

priority:
"low"|
"medium"|
"high";

assignedTo?:string;

status:
"open"|
"closed";

}
