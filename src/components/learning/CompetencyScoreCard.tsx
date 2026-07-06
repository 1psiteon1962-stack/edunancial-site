const metrics = [

"Knowledge",

"Application",

"Decision Quality",

"Problem Solving",

"Financial Analysis",

"Business Judgment",

];

export default function CompetencyScoreCard(){

return(

<section className="py-24">

<div className="mx-auto max-w-6xl px-6">

<h2 className="text-5xl font-black">

Competency Scorecard

</h2>

<div className="mt-16 space-y-6">

{metrics.map(metric=>(

<div
key={metric}
className="flex items-center justify-between rounded-xl bg-slate-900 p-6"
>

<span>{metric}</span>

<span className="font-bold">

Not Yet Assessed

</span>

</div>

))}

</div>

</div>

</section>

);

}
