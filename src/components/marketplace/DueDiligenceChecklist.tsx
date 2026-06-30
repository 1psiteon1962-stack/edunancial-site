"use client";

export default function DueDiligenceChecklist(){

const checklist=[

"Corporate Documents",

"Licenses",

"Insurance",

"Financial Statements",

"Tax Returns",

"Customer Contracts",

"Supplier Agreements",

"Bank Statements",

"Business Plan",

"Marketing Plan",

"KPIs",

"Cap Table",

"Ownership",

"Litigation Review",

"Risk Assessment"

];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-4xl font-black">

Due Diligence Checklist

</h2>

<div className="grid md:grid-cols-3 gap-6 mt-10">

{checklist.map(item=>(

<div
key={item}
className="rounded-lg bg-slate-800 p-5">

✓ {item}

</div>

))}

</div>

</section>

);

}
