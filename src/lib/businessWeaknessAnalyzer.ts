import { assessmentWeights } from "@/data/businessAssessmentWeights";

export function identifyWeaknesses(

scores: Record<string, number>

){

const weaknesses:string[]=[];

assessmentWeights.forEach(item=>{

const value=scores[item.id] ?? 0;

if(value<60){

weaknesses.push(item.id);

}

});

return weaknesses;

}

export function identifyStrengths(

scores: Record<string,number>

){

const strengths:string[]=[];

assessmentWeights.forEach(item=>{

const value=scores[item.id] ?? 0;

if(value>=80){

strengths.push(item.id);

}

});

return strengths;

}
