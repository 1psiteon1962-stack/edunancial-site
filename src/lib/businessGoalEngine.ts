export interface BusinessGoal{

id:string;

title:string;

target:number;

current:number;

}

export function calculateGoalProgress(

goal:BusinessGoal

){

if(goal.target===0)

return 0;

return Math.round(

(goal.current/

goal.target)

*100

);

}

export function goalCompleted(

goal:BusinessGoal

){

return goal.current>=goal.target;

}

export function remainingAmount(

goal:BusinessGoal

){

return Math.max(

goal.target-goal.current,

0

);

}
