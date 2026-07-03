export function prioritizeWeaknesses(

weaknesses:string[]

){

const priority=[

"cashFlow",

"profit",

"pricing",

"sales",

"marketing",

"leadership",

"hiring",

"systems",

"operations",

"growth"

];

return weaknesses.sort(

(a,b)=>

priority.indexOf(a)-

priority.indexOf(b)

);

}
