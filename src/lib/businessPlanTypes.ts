export interface BusinessPlan{

id:string;

userId:string;

businessName:string;

industry:string;

executiveSummary:string;

targetMarket:string;

products:string[];

services:string[];

status:
"draft"|
"published";

updatedAt:string;

}
