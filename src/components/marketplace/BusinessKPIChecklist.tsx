"use client";

export default function BusinessKPIChecklist(){

const items=[

"Revenue",

"Gross Profit",

"Net Profit",

"Operating Margin",

"Customer Growth",

"Customer Retention",

"Average Sale",

"Inventory",

"Cash Flow",

"Debt",

"Working Capital",

"Break Even",

"Monthly Recurring Revenue",

"Annual Growth",

"Return on Investment"

];

return(

<section className="rounded-xl bg-slate-900 p-8">

<h2 className="text-4xl font-black">

Know Your Numbers

</h2>

<div className="grid md:grid-cols-3 gap-6 mt-10">

{items.map(item=>(

<div
key={item}
className="rounded-lg bg-slate-800 p-5">

{item}

</div>

))}

</div>

</section>

);

}
