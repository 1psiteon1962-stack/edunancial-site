"use client";

export default function InvestorReadinessDashboard() {

const sections=[

"Executive Summary",

"Business Model",

"Revenue",

"Profitability",

"Cash Flow",

"Balance Sheet",

"Income Statement",

"KPIs",

"Customers",

"Marketing",

"Competition",

"Intellectual Property",

"Management Team",

"Risk Analysis",

"Growth Strategy",

"Capital Requirements"

];

return(

<main className="min-h-screen bg-[#08101f] text-white">

<section className="max-w-7xl mx-auto px-6 py-16">

<h1 className="text-5xl font-black">

Investor Readiness Dashboard

</h1>

<p className="mt-6 text-xl text-gray-300">

Measure how prepared your business is before approaching investors.

</p>

<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

{sections.map(section=>(

<div
key={section}
className="rounded-xl bg-slate-900 border border-slate-700 p-6 hover:border-blue-500">

<h2 className="text-xl font-bold">

{section}

</h2>

<p className="mt-4 text-gray-400">

Complete Assessment

</p>

</div>

))}

</div>

</section>

</main>

);

}
