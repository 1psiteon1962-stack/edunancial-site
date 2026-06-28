export default function MarketingKPIs(){

const cards=[

["Subscribers","0"],

["Downloads","0"],

["Email Opens","0"],

["Email Clicks","0"],

["Conversion Rate","0%"],

["CAC","$0.00"],

["LTV","$0.00"],

["ROAS","0.00"],

["Revenue","$0.00"],

["Lead Magnets","0"]

];

return(

<main className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-black">

Marketing KPI Dashboard

</h1>

<div className="grid gap-6 mt-10 lg:grid-cols-5">

{cards.map(([t,v])=>(

<div

key={t}

className="rounded-xl bg-slate-900 p-6"

>

<p className="text-slate-400">

{t}

</p>

<h2 className="mt-3 text-3xl font-bold">

{v}

</h2>

</div>

))}

</div>

</main>

);

}
