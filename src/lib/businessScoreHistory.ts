export interface AssessmentHistory {

date:string;

score:number;

level:string;

}

export function averageScore(

history:AssessmentHistory[]

){

if(history.length===0)

return 0;

const total=

history.reduce(

(sum,item)=>sum+item.score,

0

);

return Math.round(

total/history.length

);

}

export function improvement(

history:AssessmentHistory[]

){

if(history.length<2)

return 0;

const oldest=

history[0].score;

const newest=

history[history.length-1].score;

return newest-oldest;

}

export function highestScore(

history:AssessmentHistory[]

){

if(history.length===0)

return 0;

return Math.max(

...history.map(

item=>item.score

)

);

}
