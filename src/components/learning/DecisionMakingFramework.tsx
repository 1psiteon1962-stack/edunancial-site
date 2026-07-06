const steps = [

"Identify",

"Measure",

"Analyze",

"Decide",

"Execute",

"Review",

"Improve",

];

export default function DecisionMakingFramework(){

return(

<section className="bg-[#111827] py-24">

<div className="mx-auto max-w-7xl px-6">

<h2 className="text-5xl font-black">

The Edunancial Decision Framework

</h2>

<div className="mt-16 grid gap-8 md:grid-cols-4">

{steps.map(step=>(

<div
key={step}
className="rounded-xl bg-slate-900 p-8 text-center"
>

<h3 className="text-2xl font-bold">

{step}

</h3>

</div>

))}

</div>

</div>

</section>

);

}
