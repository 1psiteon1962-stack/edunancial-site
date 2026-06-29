export interface ProviderApplication{
id:string;
businessName:string;
contactName:string;
email:string;
phone:string;
profession:string;
country:string;
state:string;
languages:string[];
status:"pending"|"approved"|"rejected"|"more_info";
submittedAt:string;
}
