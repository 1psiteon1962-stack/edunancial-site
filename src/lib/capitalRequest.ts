export interface CapitalRequest{
id:string;
startupId:string;
amount:number;
purpose:string;
status:
"draft"|
"submitted"|
"review"|
"funded"|
"closed";
createdAt:string;
}
