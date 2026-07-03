export type BusinessStage=

"startup"|

"growth"|

"scale";

export function determineBusinessStage(

years:number

):BusinessStage{

if(years<=3){

return "startup";

}

if(years<=7){

return "growth";

}

return "scale";

}

export function recommendedCompetencyTarget(

stage:BusinessStage

){

switch(stage){

case "startup":

return 70;

case "growth":

return 80;

case "scale":

return 90;

}

}
