export default function CompetencyJourney() {

const steps=[
"Financial Literacy",
"Financial Competency",
"Economic Competency",
"Business Ownership",
"Wealth Creation",
"Generational Impact"
];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-4xl font-black text-white">

Your Journey

</h2>

<div className="mt-10 space-y-4">

{steps.map(step=>(

<div
key={step}
className="rounded-lg bg-slate-800 p-5 text-center text-white"
>

{step}

</div>

))}

</div>

</section>

);

}
