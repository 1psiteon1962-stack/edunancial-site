export interface BusinessHealthInput{

profit:number;

cashFlow:number;

sales:number;

marketing:number;

leadership:number;

operations:number;

}

export interface BusinessHealthResult{

overall:number;

grade:string;

status:string;

}

export function calculateBusinessHealth(

input:BusinessHealthInput

):BusinessHealthResult{

const overall=Math.round(

(

input.profit+

input.cashFlow+

input.sales+

input.marketing+

input.leadership+

input.operations

)/6

);

let grade="F";
let status="Critical";

if(overall>=90){

grade="A";

status="Excellent";

}

else if(overall>=80){

grade="B";

status="Strong";

}

else if(overall>=70){

grade="C";

status="Stable";

}

else if(overall>=60){

grade="D";

status="Needs Improvement";

}

return{

overall,

grade,

status

};

}
