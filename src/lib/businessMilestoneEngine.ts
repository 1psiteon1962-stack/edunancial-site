export interface Milestone{

title:string;

completed:boolean;

}

export function generateMilestones(

score:number

):Milestone[]{

return[

{

title:"Reach Competency Score of 60",

completed:score>=60

},

{

title:"Reach Competency Score of 70",

completed:score>=70

},

{

title:"Reach Competency Score of 80",

completed:score>=80

},

{

title:"Reach Competency Score of 90",

completed:score>=90

},

{

title:"Master Business Competency",

completed:score>=95

}

];

}
