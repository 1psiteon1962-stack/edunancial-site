import { BusinessHealthResult } from "./businessHealthScore";

export function executiveSummary(

health:BusinessHealthResult,

strengths:string[],

weaknesses:string[]

){

return{

headline:

`Business Health: ${health.status}`,

summary:

`Overall competency score: ${health.overall}. Current grade: ${health.grade}.`,

strengths,

weaknesses,

priority:

weaknesses.length>0

?weaknesses[0]

:"Continue improving all competency areas."

};

}
