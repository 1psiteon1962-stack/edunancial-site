export interface Opportunity {

id:string;

title:string;

description:string;

priority:number;

}

export function identifyBusinessOpportunities(

answers:Record<string,string>

):Opportunity[]{

const opportunities:Opportunity[]=[];

if(
answers.profitability==="Yes"
){

opportunities.push({

id:"scale",

title:"Expansion Opportunity",

description:
"Your business may be ready for expansion.",

priority:10

});

}

if(
answers.cashflow==="Excellent"
){

opportunities.push({

id:"investment",

title:"Investment Opportunity",

description:
"Excess cash flow can be invested for future growth.",

priority:9

});

}

if(
answers.numbers==="Daily"
){

opportunities.push({

id:"analytics",

title:"Advanced Analytics",

description:
"Use KPI forecasting to improve decision making.",

priority:8

});

}

if(
answers.marketing==="Multiple Sources"
){

opportunities.push({

id:"marketing",

title:"Marketing Optimization",

description:
"Optimize return on marketing investment.",

priority:8

});

}

return opportunities.sort(

(a,b)=>b.priority-a.priority

);

}
