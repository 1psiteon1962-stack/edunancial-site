export default function KPIDashboard(){

const kpis=[

"Revenue",

"Profit",

"Customers",

"Conversion Rate",

"Average Sale",

"Inventory",

"Cash Flow",

"Growth"

];

return(

<section className="py-24 bg-[#111827]">

<div className="max-w-7xl mx-auto px-6">

<h2 className="text-5xl font-black">

KPI Dashboard

</h2>

<div className="grid md:grid-cols-4 gap-6 mt-12">

{kpis.map(kpi=>(

<div
key={kpi}
className="rounded-xl bg-slate-900 p-8">

{kpi}

</div>

))}

</div>

</div>

</section>

);

}
