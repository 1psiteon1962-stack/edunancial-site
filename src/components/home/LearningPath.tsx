export default function LearningPath(){

const steps=[

"Financial Foundations",

"Budgeting",

"Debt",

"Emergency Fund",

"Investing",

"Real Estate",

"Business",

"Advanced Wealth Building"

];

return(

<section className="py-24 bg-[#08101f]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Suggested Learning Path

</h2>

<div className="grid md:grid-cols-4 gap-6 mt-12">

{steps.map(step=>(

<div
key={step}
className="rounded-xl bg-[#111827] p-6 text-center">

{step}

</div>

))}

</div>

</div>

</section>

);

}
