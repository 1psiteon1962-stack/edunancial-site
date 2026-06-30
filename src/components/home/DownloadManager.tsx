"use client";

export default function DownloadManager(){

const downloads=[

"10 Rules to Build Wealth",

"Financial Terms Glossary",

"Startup Checklist",

"Business KPI Worksheet",

"Personal Budget Worksheet",

"Net Worth Tracker",

"Goal Planner",

"Investment Checklist"

];

return(

<section className="bg-[#08101f] py-24">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

Downloads Manager

</h2>

<div className="grid lg:grid-cols-2 gap-8 mt-12">

{downloads.map(item=>(

<div
key={item}
className="rounded-xl bg-slate-900 border border-slate-700 p-8">

<h3 className="text-2xl font-bold">

{item}

</h3>

<div className="mt-6 flex gap-4">

<button className="rounded-xl bg-blue-600 px-6 py-3 font-bold">

Edit

</button>

<button className="rounded-xl bg-green-600 px-6 py-3 font-bold">

Upload PDF

</button>

</div>

</div>

))}

</div>

</div>

</section>

);

}
